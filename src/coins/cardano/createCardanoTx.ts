import axios, { AxiosResponse } from 'axios'
import * as cbor from 'borc'
import {
  blake2b,
  mnemonicToRootKeypair,
  packRewardAddress,
  getPubKeyBlake2b224Hash,
  AddressTypes,
  bech32,
  getShelleyAddressNetworkId,
  base58,
  getAddressType,
} from 'cardano-crypto.js'
import { Buffer } from 'buffer'

// Config
import { shelleyPath, shelleyStakeAccountPath, HARDENED_THRESHOLD } from './config'

// Utils
import {
  cborizeTxOutputs,
  cborizeTxInputs,
  cborizeTxCertificates,
  cborizeTxWithdrawals,
  bechAddressToHex,
  parseToken,
  getTokenBundlesDifference,
  aggregateTokenBundles,
} from './getNetworkFee'
import { formatValue } from './index'
import { getCryptoProvider, baseAddressFromXpub, xpub2pub } from './utils'
import { minus, plus } from '@utils/bn'

// Types
import { TCreateTxProps } from '@coins/types'
import {
  TransactionSummary,
  TxInput,
  TxOutput,
  TxPlan,
  TxAux,
  TxCertificate,
  TxWithdrawal,
  TxAuxiliaryData,
  TxBodyKey,
  AddressToPathMapper,
  AddressWithMeta,
  AddressToPathMapping,
  MyAddressesParams,
  BIP32Path,
  CryptoProvider,
  AddressProvider,
  NetworkId,
  AddressManagerParams,
  BulkAddressesSummary,
  BulkAddressesSummaryResponse,
  TxSummaryEntry,
  CaTxEntry,
  TokenBundle,
} from './types'

const ShelleyTxAux = ({
  inputs,
  outputs,
  fee,
  ttl,
  certificates,
  withdrawals,
  auxiliaryDataHash,
  auxiliaryData,
  validityIntervalStart,
}: {
  inputs: TxInput[]
  outputs: TxOutput[]
  fee: number
  ttl: number
  certificates: TxCertificate[]
  withdrawals: TxWithdrawal[]
  auxiliaryDataHash: string | null
  auxiliaryData: TxAuxiliaryData | null
  validityIntervalStart: number | null
}): TxAux => {
  function getId() {
    return blake2b(
      cbor.encode(
        ShelleyTxAux({
          inputs,
          outputs,
          fee,
          ttl,
          certificates,
          withdrawals,
          auxiliaryDataHash,
          auxiliaryData,
          validityIntervalStart,
        })
      ),
      32
    ).toString('hex')
  }

  function encodeCBOR(encoder: any) {
    const txBody = new Map<TxBodyKey, any>()
    txBody.set(TxBodyKey.INPUTS, cborizeTxInputs(inputs))
    txBody.set(TxBodyKey.OUTPUTS, cborizeTxOutputs(outputs))
    txBody.set(TxBodyKey.FEE, fee)
    if (ttl !== null) {
      txBody.set(TxBodyKey.TTL, ttl)
    }
    if (certificates.length) {
      txBody.set(TxBodyKey.CERTIFICATES, cborizeTxCertificates(certificates))
    }
    if (withdrawals.length) {
      txBody.set(TxBodyKey.WITHDRAWALS, cborizeTxWithdrawals(withdrawals))
    }
    if (auxiliaryDataHash) {
      txBody.set(TxBodyKey.AUXILIARY_DATA_HASH, Buffer.from(auxiliaryDataHash, 'hex'))
    }
    if (validityIntervalStart !== null) {
      txBody.set(TxBodyKey.VALIDITY_INTERVAL_START, validityIntervalStart)
    }
    return encoder.pushAny(txBody)
  }

  return {
    getId,
    inputs,
    outputs,
    fee,
    ttl,
    certificates,
    withdrawals,
    auxiliaryDataHash,
    auxiliaryData,
    validityIntervalStart,
    encodeCBOR,
  }
}

const prepareTxAux = async (txPlan: TxPlan, ttl: number) => {
  const { inputs, outputs, change, fee, certificates, withdrawals } = txPlan

  const changeOutputs: TxOutput[] = change.map((output) => ({
    ...output,
    isChange: true,
    spendingPath: shelleyPath,
    stakingPath: shelleyStakeAccountPath,
  }))

  return ShelleyTxAux({
    inputs,
    outputs: [...outputs, ...changeOutputs],
    fee,
    ttl,
    certificates,
    withdrawals,
    auxiliaryDataHash: '',
    auxiliaryData: null,
    validityIntervalStart: null,
  })
}

const DummyAddressManager = () => {
  return {
    discoverAddresses: (): Promise<string[]> => Promise.resolve([]),
    discoverAddressesWithMeta: (): Promise<AddressWithMeta[]> => Promise.resolve([]),
    getAddressToAbsPathMapping: (): AddressToPathMapping => ({}),
    _deriveAddress: (): Promise<null> => Promise.resolve(null),
  }
}

const toBip32StringPath = (derivationPath: any) => {
  return `m/${derivationPath
    .map((item: any) => (item % HARDENED_THRESHOLD) + (item >= HARDENED_THRESHOLD ? "'" : ''))
    .join('/')}`
}

async function _fetchBulkAddressInfo(
  addresses: Array<string>
): Promise<BulkAddressesSummary | undefined> {
  const { data }: AxiosResponse<BulkAddressesSummaryResponse> = await axios(
    'https://explorer2.adalite.io/api/bulk/addresses/summary',
    {
      method: 'POST',
      data: JSON.stringify(addresses),
    }
  )

  return 'Right' in data ? data.Right : undefined
}

const isSomeAddressUsed = async (addresses: string[]): Promise<boolean> => {
  const addressInfos = await _fetchBulkAddressInfo(addresses)

  if (addressInfos) {
    return addressInfos.caTxNum > 0
  }

  return false
}

const range = function range(start = 0, stop: number) {
  return Array.from({ length: stop - start }, (x, i) => start + i)
}

function prepareTxHistoryEntry(tx: CaTxEntry, addresses: string[]): TxSummaryEntry {
  const outputTokenBundle: TokenBundle[] = []
  const inputTokenBundle: TokenBundle[] = []

  let effect = 0 //effect on wallet balance accumulated
  for (const [address, amount] of tx.ctbInputs || []) {
    if (addresses.includes(address)) {
      effect -= +amount.getCoin
      const parsedInputTokenBundle = amount.getTokens.map((token) => parseToken(token))
      inputTokenBundle.push(parsedInputTokenBundle)
    }
  }
  for (const [address, amount] of tx.ctbOutputs || []) {
    if (addresses.includes(address)) {
      effect += +amount.getCoin
      const parsedOutputTokenBundle = amount.getTokens.map((token) => parseToken(token))
      outputTokenBundle.push(parsedOutputTokenBundle)
    }
  }
  return {
    ...tx,
    fee: parseInt(tx.fee, 10),
    effect: effect,
    tokenEffects: getTokenBundlesDifference(
      aggregateTokenBundles(outputTokenBundle),
      aggregateTokenBundles(inputTokenBundle)
    ),
  }
}

function filterValidTransactions<T extends CaTxEntry | TxSummaryEntry>(txs: T[]): T[] {
  return txs.filter((tx) => tx.isValid)
}

async function getTxHistory(addresses: Array<string>): Promise<TxSummaryEntry[]> {
  const chunks = range(0, Math.ceil(addresses.length / 20))

  // @ts-ignore
  const cachedAddressInfos: { caTxList: CaTxEntry[] } = (
    await Promise.all(
      chunks.map(async (index) => {
        const beginIndex = index * 20
        return await _fetchBulkAddressInfo(addresses.slice(beginIndex, beginIndex + 20))
      })
    )
  ).reduce(
    // @ts-ignore
    (acc, elem) => {
      return {
        // @ts-ignore
        caTxList: [...acc.caTxList, ...elem.caTxList],
      }
    },
    { caTxList: [] }
  )

  const filteredTxs: { [ctbId: string]: CaTxEntry } = {}
  cachedAddressInfos.caTxList.forEach((tx) => {
    filteredTxs[tx.ctbId] = tx
  })

  const txHistoryEntries = Object.values(filteredTxs).map((tx) => {
    return prepareTxHistoryEntry(tx, addresses)
  })
  const validTransactions = filterValidTransactions(txHistoryEntries)

  return validTransactions.sort((a, b) => b.ctbTimeIssued - a.ctbTimeIssued)
}

const filterUsedAddresses = async (addresses: string[]): Promise<Set<string>> => {
  const txHistory = await getTxHistory(addresses)
  const usedAddresses = new Set<string>()
  txHistory.forEach((trx) => {
    ;(trx.ctbOutputs || []).forEach((output) => {
      usedAddresses.add(output[0])
    })
    ;(trx.ctbInputs || []).forEach((input) => {
      usedAddresses.add(input[0])
    })
  })

  return usedAddresses
}

const AddressManager = ({ addressProvider, gapLimit }: AddressManagerParams) => {
  const deriveAddressMemo: {
    [key: number]: { path: BIP32Path; address: string }
  } = {}

  async function cachedDeriveAddress(index: number): Promise<string> {
    const memoKey = index

    if (!deriveAddressMemo[memoKey]) {
      deriveAddressMemo[memoKey] = await addressProvider(index)
    }

    return deriveAddressMemo[memoKey].address
  }

  async function deriveAddressesBlock(beginIndex: number, endIndex: number): Promise<string[]> {
    const derivedAddresses: string[] = []
    for (let i = beginIndex; i < endIndex; i += 1) {
      derivedAddresses.push(await cachedDeriveAddress(i))
    }
    return derivedAddresses
  }

  async function discoverAddresses(): Promise<string[]> {
    let addresses: string[] = []
    let from = 0
    let isGapBlock = false

    while (!isGapBlock) {
      const currentAddressBlock = await deriveAddressesBlock(from, from + gapLimit)

      isGapBlock = !(await isSomeAddressUsed(currentAddressBlock))

      addresses =
        isGapBlock && addresses.length > 0 ? addresses : addresses.concat(currentAddressBlock)
      from += gapLimit
    }

    return addresses
  }

  async function discoverAddressesWithMeta(): Promise<AddressWithMeta[]> {
    const addresses = await discoverAddresses()
    const usedAddresses = await filterUsedAddresses(addresses)

    return addresses.map((address) => {
      return {
        address,
        bip32StringPath: toBip32StringPath(getAddressToAbsPathMapping()[address]),
        isUsed: usedAddresses.has(address),
      }
    })
  }

  function getAddressToAbsPathMapping(): AddressToPathMapping {
    const result: AddressToPathMapping = {}
    Object.values(deriveAddressMemo).map((value) => {
      result[value.address] = value.path
    })

    return result
  }

  return {
    discoverAddresses,
    discoverAddressesWithMeta,
    getAddressToAbsPathMapping,
    _deriveAddress: cachedDeriveAddress,
    _deriveAddresses: deriveAddressesBlock,
  }
}

const shelleyStakeAccountPathFnc = (account: number): BIP32Path => {
  return [HARDENED_THRESHOLD + 1852, HARDENED_THRESHOLD + 1815, HARDENED_THRESHOLD + account, 2, 0]
}

const shelleyPathFnc = (account: number, isChange: boolean, addrIdx: number): BIP32Path => {
  return [
    HARDENED_THRESHOLD + 1852,
    HARDENED_THRESHOLD + 1815,
    HARDENED_THRESHOLD + account,
    isChange ? 1 : 0,
    addrIdx,
  ]
}

const encodeAddress = (address: Buffer): string => {
  const addressType = getAddressType(address)
  if (addressType === AddressTypes.BOOTSTRAP) {
    return base58.encode(address)
  }
  const addressPrefixes: { [key: number]: string } = {
    [AddressTypes.BASE]: 'addr',
    [AddressTypes.POINTER]: 'addr',
    [AddressTypes.ENTERPRISE]: 'addr',
    [AddressTypes.REWARD]: 'stake',
  }
  const isTestnet = getShelleyAddressNetworkId(address) === NetworkId.TESTNET
  const addressPrefix = `${addressPrefixes[addressType]}${isTestnet ? '_test' : ''}`
  return bech32.encode(addressPrefix, address)
}

const xpub2blake2b224Hash = (xpub: Buffer) => getPubKeyBlake2b224Hash(xpub2pub(xpub))

const stakingAddressFromXpub = (stakeXpub: Buffer, networkId: NetworkId): string => {
  const addrBuffer: Buffer = packRewardAddress(xpub2blake2b224Hash(stakeXpub), networkId)
  return encodeAddress(addrBuffer)
}

const ShelleyStakingAccountProvider =
  (cryptoProvider: CryptoProvider, accountIndex: number): AddressProvider =>
  async () => {
    const pathStake = shelleyStakeAccountPathFnc(accountIndex)
    const stakeXpub = await cryptoProvider.deriveXpub(pathStake)

    return {
      path: pathStake,
      address: stakingAddressFromXpub(stakeXpub, cryptoProvider.network.networkId),
    }
  }

const ShelleyBaseAddressProvider =
  (cryptoProvider: CryptoProvider, accountIndex: number, isChange: boolean): AddressProvider =>
  async (i: number) => {
    const pathSpend = shelleyPathFnc(accountIndex, isChange, i)
    const spendXpub = await cryptoProvider.deriveXpub(pathSpend)

    const pathStake = shelleyStakeAccountPathFnc(accountIndex)
    const stakeXpub = await cryptoProvider.deriveXpub(pathStake)

    return {
      path: pathSpend,
      address: baseAddressFromXpub(spendXpub, stakeXpub),
    }
  }

const MyAddresses = ({ accountIndex, cryptoProvider, gapLimit }: MyAddressesParams) => {
  const legacyExtManager = DummyAddressManager()
  const legacyIntManager = DummyAddressManager()

  const accountAddrManager = AddressManager({
    addressProvider: ShelleyStakingAccountProvider(cryptoProvider, accountIndex),
    gapLimit: 1,
  })

  const baseExtAddrManager = AddressManager({
    addressProvider: ShelleyBaseAddressProvider(cryptoProvider, accountIndex, false),
    gapLimit,
  })

  const baseIntAddrManager = AddressManager({
    addressProvider: ShelleyBaseAddressProvider(cryptoProvider, accountIndex, true),
    gapLimit,
  })

  function fixedPathMapper(): AddressToPathMapper {
    const mappingLegacy = {
      ...legacyIntManager.getAddressToAbsPathMapping(),
      ...legacyExtManager.getAddressToAbsPathMapping(),
    }
    const mappingShelley = {
      ...baseIntAddrManager.getAddressToAbsPathMapping(),
      ...baseExtAddrManager.getAddressToAbsPathMapping(),
      ...accountAddrManager.getAddressToAbsPathMapping(),
    }

    const fixedShelley: { [i: string]: BIP32Path } = {}
    for (const key in mappingShelley) {
      fixedShelley[bechAddressToHex(key)] = mappingShelley[key]
    }
    return (address: string) => {
      return mappingLegacy[address] || fixedShelley[address] || mappingShelley[address]
    }
  }

  return {
    fixedPathMapper,
  }
}

const checkChange = (
  addressFrom: string,
  utxos: TxOutput[],
  amount: string,
  fee: number
): TxOutput[] => {
  const totalAmount = plus(formatValue(amount, 'to'), formatValue(fee, 'to'))
  const mapUtxosAmount = utxos.map((utxo: TxOutput) => utxo.coins).reduce((a, b) => a + b, 0)
  if (minus(mapUtxosAmount, totalAmount) !== 0) {
    return [
      {
        address: addressFrom,
        coins: minus(mapUtxosAmount, totalAmount),
        isChange: false,
        tokenBundle: [],
      },
    ]
  }

  return []
}

const getOutputs = (
  addressFrom: string,
  addressTo: string,
  amount: string,
  change: TxOutput[],
  utxos: TxOutput[]
): TxOutput[] => {
  const data: TxOutput[] = []

  let tokenTransferAmount = 0

  const getTokenBundleUtxos = utxos.filter((utxo: TxOutput) => utxo.tokenBundle.length > 0)

  if (!change.length && getTokenBundleUtxos.length) {
    tokenTransferAmount = 1444443

    for (const utxo of getTokenBundleUtxos) {
      data.push({
        address: addressFrom,
        coins: 1444443,
        isChange: false,
        tokenBundle: utxo.tokenBundle,
      })
    }
  }

  data.push({
    address: addressTo,
    coins: minus(formatValue(amount, 'to'), tokenTransferAmount),
    isChange: false,
    tokenBundle: [],
  })

  return data
}

const createCardanoTx = async (props: TCreateTxProps, ttl: number): Promise<string | null> => {
  const { mnemonic, utxos, addressTo, amount, addressFrom, fee } = props

  if (!mnemonic) {
    return null
  }

  const change = checkChange(addressFrom, utxos as any, amount, fee)
  const outputs = getOutputs(addressFrom, addressTo, amount, change, utxos as any)

  const txSummary: TransactionSummary = {
    address: addressTo,
    coins: +formatValue(amount, 'to'),
    fee: +formatValue(fee, 'to'),
    minimalLovelaceAmount: 0,
    plan: {
      additionalLovelaceAmount: 0,
      auxiliaryData: null,
      baseFee: +formatValue(fee, 'to'),
      certificates: [],
      change,
      deposit: 0,
      fee: +formatValue(fee, 'to'),
      inputs: utxos as any,
      outputs,
      withdrawals: [],
    },
    token: null,
    type: 'send',
  }

  const txAux = await prepareTxAux(txSummary.plan, ttl)

  const rootSecret = await mnemonicToRootKeypair(mnemonic, 2)
  const cryptoProvider = await getCryptoProvider(rootSecret)

  const myAddresses = MyAddresses({
    accountIndex: 0,
    cryptoProvider,
    gapLimit: 20,
  })

  const { txBody } = await cryptoProvider.signTx(txAux, myAddresses.fixedPathMapper())

  return txBody
}

export default createCardanoTx

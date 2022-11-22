import { AddressTypes, getAddressType, bech32, base58 } from 'cardano-crypto.js'
import * as cbor from 'borc'
import _ from 'lodash'
import { Buffer } from 'buffer'

// Utils
import { getCardanoAsset } from '@utils/api'

// Types
import {
  TCardanoOutput,
  TCardanoOutputAmount,
  UTxO,
  TxPlanDraft,
  CertificateType,
  TokenBundle,
  TxInput,
  TxOutput,
  TxCertificate,
  TxWithdrawal,
  TxPlanAuxiliaryData,
  TokenObject,
  Token,
  OrderedTokenBundle,
  CborizedTxTokenBundle,
  CborizedTxOutput,
  TxPlanResult,
  CborizedVotingRegistrationMetadata,
  CborizedTxAmount,
  TxStakingKeyRegistrationCert,
  CborizedTxStakingKeyRegistrationCert,
  TxPlanVotingAuxiliaryData,
  CborizedTxStakeCredential,
  TxStakeCredentialType,
  TxCertificateKey,
  CborizedTxCertificate,
  TxStakingKeyDeregistrationCert,
  CborizedTxStakingKeyDeregistrationCert,
  TxDelegationCert,
  CborizedTxDelegationCert,
  TxStakepoolRegistrationCert,
  CborizedTxStakepoolRegistrationCert,
  CborizedTxInput,
  TxRelayType,
  CborizedTxWithdrawals,
} from './types'

const TX_WITNESS_SIZES = {
  byronv2: 139,
  shelley: 139,
  byronV1: 170,
}
const MAX_TX_SIZE = 16384
const MIN_UTXO_VALUE = 1000000
const MAX_TX_OUTPUT_SIZE = 4000
const CATALYST_SIGNATURE_BYTE_LENGTH = 64
const MAX_OUTPUT_TOKENS = 50
const METADATA_HASH_BYTE_LENGTH = 32

const getTokenBundle = async (output: TCardanoOutput): Promise<TokenBundle> => {
  const data: TokenBundle = []

  const getOutputTokens = output.ctaAmount.filter(
    (i: TCardanoOutputAmount) => i.unit !== 'lovelace'
  )

  if (getOutputTokens.length) {
    for (const token of getOutputTokens) {
      const { quantity, unit } = token
      const assetInfo = await getCardanoAsset(unit)

      if (assetInfo) {
        const { asset_name, policy_id } = assetInfo

        data.push({
          assetName: asset_name,
          policyId: policy_id,
          quantity: Number(quantity),
        })
      }
    }
  }

  return data
}

const formatUtxos = async (outputs: TCardanoOutput[], addressFrom: string): Promise<UTxO[]> => {
  const data: UTxO[] = []

  for (const output of outputs) {
    const getLovelace = output.ctaAmount.find((i: TCardanoOutputAmount) => i.unit === 'lovelace')

    const tokenBundle = await getTokenBundle(output)

    data.push({
      address: addressFrom,
      coins: getLovelace ? Number(getLovelace.quantity) : 0,
      outputIndex: output.ctaTxIndex,
      tokenBundle,
      txHash: output.ctaTxHash,
    })
  }

  return data
}

const isBase = (address: string): boolean => {
  return getAddressType(Buffer.from(address, 'hex')) === AddressTypes.BASE
}

const isShelleyFormat = (address: string): boolean => {
  return address.startsWith('addr') || address.startsWith('stake')
}

export const bechAddressToHex = (address: string): string => {
  const parsed = bech32.decode(address)

  return parsed.data.toString('hex')
}

export const base58AddressToHex = (address: string): string => {
  const parsed = base58.decode(address)
  return parsed.toString('hex')
}

export const addressToHex = (address: string): string => {
  return isShelleyFormat(address) ? bechAddressToHex(address) : base58AddressToHex(address)
}

const arrangeUtxos = (utxos: UTxO[]): UTxO[] => {
  const sortedUtxos = utxos.sort((a, b) =>
    a.txHash === b.txHash ? a.outputIndex - b.outputIndex : a.txHash.localeCompare(b.txHash)
  )
  const nonStakingUtxos = sortedUtxos.filter(({ address }) => !isBase(addressToHex(address)))
  const baseAddressUtxos = sortedUtxos.filter(({ address }) => isBase(addressToHex(address)))
  const adaOnlyUtxos = baseAddressUtxos.filter(({ tokenBundle }) => tokenBundle?.length === 0)
  const tokenUtxos = baseAddressUtxos.filter(({ tokenBundle }) => tokenBundle.length > 0)

  return [...nonStakingUtxos, ...adaOnlyUtxos, ...tokenUtxos]
}

export const arraySum = (numbers: Array<number>): number =>
  numbers.reduce((acc: number, val) => acc + val, 0)

export const parseToken = (token: TokenObject): Token => ({
  ...token,
  quantity: parseInt(token.quantity, 10),
})

const orderTokenBundle = (tokenBundle: TokenBundle): OrderedTokenBundle => {
  const compareStringsCanonically = (string1: string, string2: string) =>
    string1.length - string2.length || string1.localeCompare(string2)
  return _(tokenBundle)
    .orderBy(['policyId', 'assetName'], ['asc', 'asc'])
    .groupBy(({ policyId }) => policyId)
    .mapValues((tokens) => tokens.map(({ assetName, quantity }) => ({ assetName, quantity })))
    .map((tokens, policyId) => ({
      policyId,
      assets: tokens.sort((token1, token2) =>
        compareStringsCanonically(token1.assetName, token2.assetName)
      ),
    }))
    .sort((token1, token2) => compareStringsCanonically(token1.policyId, token2.policyId))
    .value()
}

const cborizeTxOutputTokenBundle = (tokenBundle: TokenBundle): CborizedTxTokenBundle => {
  const policyIdMap = new Map()
  const orderedTokenBundle = orderTokenBundle(tokenBundle)
  orderedTokenBundle.forEach(({ policyId, assets }) => {
    const assetMap = new Map()
    assets.forEach(({ assetName, quantity }) => {
      assetMap.set(Buffer.from(assetName, 'hex'), quantity)
    })
    policyIdMap.set(Buffer.from(policyId, 'hex'), assetMap)
  })
  return policyIdMap
}

const cborizeSingleTxOutput = (output: TxOutput): CborizedTxOutput => {
  const amount: CborizedTxAmount =
    output.tokenBundle.length > 0
      ? [output.coins, cborizeTxOutputTokenBundle(output.tokenBundle)]
      : output.coins

  const addressBuff: Buffer = isShelleyFormat(output.address)
    ? bech32.decode(output.address).data
    : base58.decode(output.address)
  return [addressBuff, amount]
}

const aggregateTokenBundlesForPolicy = (policyGroup: TokenBundle, policyId: string) => {
  return _(policyGroup)
    .groupBy(({ assetName }) => assetName)
    .map((assetGroup, assetName) =>
      parseToken({
        policyId,
        assetName,
        quantity: `${arraySum(assetGroup.map((asset) => asset.quantity))}`,
      })
    )
    .value()
}

export const aggregateTokenBundles = (tokenBundle: TokenBundle[]): TokenBundle => {
  return _(tokenBundle)
    .filter((token) => !!token.length)
    .flatten()
    .groupBy(({ policyId }) => policyId)
    .map(aggregateTokenBundlesForPolicy)
    .flatten()
    .value()
}

const distinct = <T>(array: T[]) => Array.from(new Set(array)) as T[]

const computeMinUTxOLovelaceAmount = (tokenBundle: TokenBundle): number => {
  const quot = (x: number, y: number) => Math.floor(x / y)
  const roundupBytesToWords = (x: number) => quot(x + 7, 8)

  const minUTxOValue = 1000000
  const coinSize = 0
  const txOutLenNoVal = 14
  const txInLen = 7
  const utxoEntrySizeWithoutVal = 6 + txOutLenNoVal + txInLen

  const adaOnlyUtxoSize = utxoEntrySizeWithoutVal + coinSize
  const aggregatedTokenBundle = aggregateTokenBundles([tokenBundle])

  const distinctAssets = aggregatedTokenBundle.map(({ assetName }) => assetName)

  const numAssets = distinctAssets.length

  const numPIDs = distinct(aggregatedTokenBundle.map(({ policyId }) => policyId)).length

  const sumAssetNameLengths = distinctAssets.reduce(
    (acc, assetName) => acc + Math.max(Buffer.from(assetName, 'hex').byteLength, 1),
    0
  )

  const policyIdSize = 28

  const size =
    6 + roundupBytesToWords(numAssets * 12 + sumAssetNameLengths + numPIDs * policyIdSize)

  if (aggregatedTokenBundle.length === 0) {
    return minUTxOValue
  } else {
    return Math.max(
      minUTxOValue,
      quot(minUTxOValue, adaOnlyUtxoSize) * (utxoEntrySizeWithoutVal + size)
    )
  }
}

const prepareTxPlanDraft = (address: string, coins: number): TxPlanDraft => {
  return {
    outputs: [
      {
        isChange: false,
        address,
        coins,
        tokenBundle: [],
      },
    ],
    certificates: [],
    withdrawals: [],
    auxiliaryData: null,
  }
}

const validateTxPlan = (txPlanResult: TxPlanResult): TxPlanResult => {
  if (txPlanResult.success === false) {
    return txPlanResult
  }

  const { txPlan } = txPlanResult
  const {
    change,
    outputs,
    withdrawals,
    fee,
    additionalLovelaceAmount,
    certificates,
    deposit,
    baseFee,
  } = txPlan

  const noTxPlan: TxPlanResult = {
    success: false,
    error: null,
    estimatedFee: fee,
    deposit,
    minimalLovelaceAmount: additionalLovelaceAmount,
  }

  const outputsWithChange = [...outputs, ...change]
  if (
    outputsWithChange.some(({ coins, tokenBundle }) => {
      coins > Number.MAX_SAFE_INTEGER ||
        tokenBundle.some(({ quantity }) => quantity > Number.MAX_SAFE_INTEGER)
    })
  ) {
    throw new Error('')
  }

  if (change.some(({ coins, tokenBundle }) => coins < computeMinUTxOLovelaceAmount(tokenBundle))) {
    return {
      ...noTxPlan,
      error: { code: 1 },
    }
  }

  if (outputs.some(({ coins, tokenBundle }) => coins < computeMinUTxOLovelaceAmount(tokenBundle))) {
    return {
      ...noTxPlan,
      error: { code: 2 },
    }
  }

  if (
    outputsWithChange.some(
      (output) => cbor.encode(cborizeSingleTxOutput(output)).length > MAX_TX_OUTPUT_SIZE
    )
  ) {
    return noTxPlan
  }

  const totalRewards = withdrawals.reduce((acc, { rewards }) => acc + rewards, 0)
  const isDeregisteringStakeKey = certificates.some(
    (c) => c.type === CertificateType.STAKING_KEY_DEREGISTRATION
  )
  if (
    !isDeregisteringStakeKey &&
    ((totalRewards > 0 && totalRewards < fee) || (totalRewards > 0 && fee > baseFee))
  ) {
    return {
      ...noTxPlan,
      error: true,
    }
  }
  return txPlanResult
}

const computeRequiredDeposit = (certificates: TxCertificate[]) => {
  const CertificateDeposit = {
    [CertificateType.DELEGATION]: 0,
    [CertificateType.STAKEPOOL_REGISTRATION]: 500000000,
    [CertificateType.STAKING_KEY_REGISTRATION]: 2000000,
    [CertificateType.STAKING_KEY_DEREGISTRATION]: -2000000,
  }
  return certificates.reduce((acc, { type }) => acc + CertificateDeposit[type], 0)
}

const createTokenChangeOutputs = (
  changeAddress: string,
  changeTokenBundle: TokenBundle,
  maxOutputTokens: number
): TxOutput[] => {
  const nOutputs = Math.ceil(changeTokenBundle.length / maxOutputTokens)
  const outputs: TxOutput[] = []
  for (let i = 0; i < nOutputs; i++) {
    const tokenBundle = changeTokenBundle.slice(i * maxOutputTokens, (i + 1) * maxOutputTokens)
    outputs.push({
      isChange: false,
      address: changeAddress,
      coins: computeMinUTxOLovelaceAmount(tokenBundle),
      tokenBundle,
    })
  }
  return outputs
}

const txFeeFunction = (txSizeInBytes: number): number => {
  const a = 155381
  const b = 43.946

  return Math.ceil(a + txSizeInBytes * b)
}

const cborizeTxVotingRegistration = ({
  votingPubKey,
  stakePubKey,
  rewardDestinationAddress,
  nonce,
}: TxPlanVotingAuxiliaryData): [number, Map<number, Buffer | BigInt>] => [
  61284,
  new Map([
    [1, Buffer.from(votingPubKey, 'hex')],
    [2, Buffer.from(stakePubKey, 'hex')],
    [3, bech32.decode(rewardDestinationAddress.address).data],
    [4, Number(nonce)],
  ]),
]

const cborizeTxAuxiliaryVotingData = (
  txAuxiliaryData: TxPlanAuxiliaryData,
  signatureHex: string
): CborizedVotingRegistrationMetadata => [
  new Map<number, Map<number, Buffer | BigInt>>([
    cborizeTxVotingRegistration(txAuxiliaryData),
    [61285, new Map<number, Buffer>([[1, Buffer.from(signatureHex, 'hex')]])],
  ]),
  [],
]

const estimateAuxiliaryDataSize = (auxiliaryData: TxPlanAuxiliaryData) => {
  switch (auxiliaryData.type) {
    case 'CATALYST_VOTING': {
      const placeholderMetaSignature = 'x'.repeat(CATALYST_SIGNATURE_BYTE_LENGTH * 2)
      return cbor.encode(cborizeTxAuxiliaryVotingData(auxiliaryData, placeholderMetaSignature))
        .length
    }
    default:
      return null
  }
}

const cborizeStakingKeyRegistrationCert = (
  certificate: TxStakingKeyRegistrationCert
): CborizedTxStakingKeyRegistrationCert => {
  const stakingKeyHash: Buffer = bech32.decode(certificate.stakingAddress).data.slice(1)
  const stakeCredential: CborizedTxStakeCredential = [
    TxStakeCredentialType.ADDR_KEYHASH,
    stakingKeyHash,
  ]
  return [TxCertificateKey.STAKING_KEY_REGISTRATION, stakeCredential]
}

const cborizeStakingKeyDeregistrationCert = (
  certificate: TxStakingKeyDeregistrationCert
): CborizedTxStakingKeyDeregistrationCert => {
  const stakingKeyHash: Buffer = bech32.decode(certificate.stakingAddress).data.slice(1)
  const stakeCredential: CborizedTxStakeCredential = [
    TxStakeCredentialType.ADDR_KEYHASH,
    stakingKeyHash,
  ]
  return [TxCertificateKey.STAKING_KEY_DEREGISTRATION, stakeCredential]
}

const cborizeDelegationCert = (certificate: TxDelegationCert): CborizedTxDelegationCert => {
  const stakingKeyHash: Buffer = bech32.decode(certificate.stakingAddress).data.slice(1)
  const stakeCredential: CborizedTxStakeCredential = [
    TxStakeCredentialType.ADDR_KEYHASH,
    stakingKeyHash,
  ]
  const poolHash = Buffer.from(certificate.poolHash, 'hex')
  return [TxCertificateKey.DELEGATION, stakeCredential, poolHash]
}

const ipv4AddressToBuf = (ipv4Address: string) => {
  const splitAddressNumbers = ipv4Address.split('.').map((x) => +x)
  return Buffer.from(splitAddressNumbers)
}

const ipv6AddressToBuf = (ipv6Address: string) => {
  const ipv6NoSemicolons = ipv6Address.replace(/:/g, '')
  const ipv6Buf = Buffer.from(ipv6NoSemicolons, 'hex')
  const copy = Buffer.from(ipv6Buf)
  const endianSwappedBuf = copy.swap32()
  return endianSwappedBuf
}

const cborizeStakepoolRegistrationCert = (
  certificate: TxStakepoolRegistrationCert
): CborizedTxStakepoolRegistrationCert => {
  const { poolRegistrationParams } = certificate

  return [
    TxCertificateKey.STAKEPOOL_REGISTRATION,
    Buffer.from(poolRegistrationParams.poolKeyHashHex, 'hex'),
    Buffer.from(poolRegistrationParams.vrfKeyHashHex, 'hex'),
    parseInt(poolRegistrationParams.pledgeStr, 10),
    parseInt(poolRegistrationParams.costStr, 10),
    new cbor.Tagged(
      30,
      [
        parseInt(poolRegistrationParams.margin.numeratorStr, 10),
        parseInt(poolRegistrationParams.margin.denominatorStr, 10),
      ],
      null
    ),
    Buffer.from(poolRegistrationParams.rewardAccountHex, 'hex'),
    poolRegistrationParams.poolOwners.map((ownerObj: any) => {
      return Buffer.from(ownerObj.stakingKeyHashHex, 'hex')
    }),
    poolRegistrationParams.relays.map((relay: any) => {
      switch (relay.type) {
        case TxRelayType.SINGLE_HOST_IP:
          return [
            relay.type,
            relay.params.portNumber,
            relay.params.ipv4 ? ipv4AddressToBuf(relay.params.ipv4) : null,
            relay.params.ipv6 ? ipv6AddressToBuf(relay.params.ipv6) : null,
          ]
        case TxRelayType.SINGLE_HOST_NAME:
          return [relay.type, relay.params.portNumber, relay.params.dnsName]
        case TxRelayType.MULTI_HOST_NAME:
          return [relay.type, relay.params.dnsName]
        default:
          return []
      }
    }),
    poolRegistrationParams.metadata
      ? [
          poolRegistrationParams.metadata.metadataUrl,
          Buffer.from(poolRegistrationParams.metadata.metadataHashHex, 'hex'),
        ]
      : null,
  ]
}

export const cborizeTxCertificates = (certificates: TxCertificate[]): CborizedTxCertificate[] => {
  const txCertificates = certificates.map((certificate) => {
    switch (certificate.type) {
      case CertificateType.STAKING_KEY_REGISTRATION:
        return cborizeStakingKeyRegistrationCert(certificate)
      case CertificateType.STAKING_KEY_DEREGISTRATION:
        return cborizeStakingKeyDeregistrationCert(certificate)
      case CertificateType.DELEGATION:
        return cborizeDelegationCert(certificate)
      case CertificateType.STAKEPOOL_REGISTRATION:
        return cborizeStakepoolRegistrationCert(certificate)
      default:
        return cborizeStakingKeyRegistrationCert(certificate)
    }
  })
  return txCertificates
}

export const cborizeTxInputs = (inputs: TxInput[]): CborizedTxInput[] => {
  const txInputs: CborizedTxInput[] = inputs.map(({ txHash, outputIndex }) => {
    const txId = Buffer.from(txHash, 'hex')
    return [txId, outputIndex]
  })

  return txInputs
}

export const cborizeTxOutputs = (outputs: TxOutput[]): CborizedTxOutput[] => {
  return outputs.map(cborizeSingleTxOutput)
}

export const cborizeTxWithdrawals = (withdrawals: TxWithdrawal[]): CborizedTxWithdrawals => {
  const txWithdrawals: CborizedTxWithdrawals = new Map()
  withdrawals.forEach((withdrawal) => {
    const stakingAddress: Buffer = bech32.decode(withdrawal.stakingAddress).data
    txWithdrawals.set(stakingAddress, withdrawal.rewards)
  })
  return txWithdrawals
}

const isV1Address = (address: string) => address.startsWith('D')

const estimateTxSize = (
  inputs: Array<TxInput>,
  outputs: Array<TxOutput>,
  certificates: Array<TxCertificate>,
  withdrawals: Array<TxWithdrawal>,
  auxiliaryData: TxPlanAuxiliaryData | null
) => {
  const txInputsSize = cbor.encode(cborizeTxInputs(inputs)).length + 1

  const txOutputs: TxOutput[] = outputs.map((output) => ({
    isChange: false,
    address: output.address,
    coins: Number.MAX_SAFE_INTEGER,
    tokenBundle: output.tokenBundle,
  }))

  const txOutputsSize = cbor.encode(cborizeTxOutputs(txOutputs)).length + 1

  const txCertificatesSize = cbor.encode(cborizeTxCertificates(certificates)).length + 1
  const txWithdrawalsSize = cbor.encode(cborizeTxWithdrawals(withdrawals)).length + 1
  const txTllSize = cbor.encode(Number.MAX_SAFE_INTEGER).length + 1
  const txFeeSize = cbor.encode(Number.MAX_SAFE_INTEGER).length + 1
  const txAuxiliaryDataHashSize = auxiliaryData
    ? cbor.encode('x'.repeat(METADATA_HASH_BYTE_LENGTH * 2)).length + 1
    : 0
  const txAuxSize =
    txInputsSize +
    txOutputsSize +
    txCertificatesSize +
    txWithdrawalsSize +
    txFeeSize +
    txTllSize +
    txAuxiliaryDataHashSize

  const shelleyInputs = inputs.filter(({ address }) => isShelleyFormat(address))
  const byronInputs = inputs.filter(({ address }) => !isShelleyFormat(address))

  const shelleyWitnessesSize =
    (withdrawals.length + certificates.length + shelleyInputs.length) * TX_WITNESS_SIZES.shelley

  const byronWitnessesSize = byronInputs.reduce((acc, { address }) => {
    const witnessSize = isV1Address(address) ? TX_WITNESS_SIZES.byronV1 : TX_WITNESS_SIZES.byronv2
    return acc + witnessSize
  }, 0)

  const txWitnessesSize = shelleyWitnessesSize + byronWitnessesSize

  const txAuxiliaryDataEstimate = auxiliaryData ? estimateAuxiliaryDataSize(auxiliaryData) + 1 : 0
  const txAuxiliaryDataSize = txAuxiliaryDataEstimate + 1

  const txSizeInBytes = 1 + txAuxSize + txWitnessesSize + txAuxiliaryDataSize

  if (txSizeInBytes > MAX_TX_SIZE) {
    return null
  }

  const slack = 1

  return txSizeInBytes + slack
}

export const getTokenBundlesDifference = (
  tokenBundle1: TokenBundle,
  tokenBundle2: TokenBundle
): TokenBundle => {
  const negativeTokenBundle = tokenBundle2.map((token) => ({
    ...token,
    quantity: -token.quantity,
  }))
  return aggregateTokenBundles([tokenBundle1, negativeTokenBundle]).filter(
    (token) => token.quantity !== 0
  )
}

const computeRequiredTxFee = (
  inputs: Array<TxInput>,
  outputs: Array<TxOutput>,
  certificates: Array<TxCertificate> = [],
  withdrawals: Array<TxWithdrawal> = [],
  auxiliaryData: TxPlanAuxiliaryData | null = null
) => {
  return txFeeFunction(estimateTxSize(inputs, outputs, certificates, withdrawals, auxiliaryData))
}

const computeTxPlan = (
  inputs: TxInput[],
  outputs: TxOutput[],
  possibleChange: TxOutput,
  certificates: TxCertificate[],
  withdrawals: TxWithdrawal[],
  auxiliaryData: TxPlanAuxiliaryData | null
): TxPlanResult => {
  const totalRewards = withdrawals.reduce((acc, { rewards }) => acc + rewards, 0)
  const totalInput = inputs.reduce((acc, input) => acc + input.coins, 0) + totalRewards
  const totalInputTokens = aggregateTokenBundles(
    // @ts-ignore
    inputs.map(({ tokenBundle }) => tokenBundle)
  )
  const deposit = computeRequiredDeposit(certificates)
  const totalOutput = outputs.reduce((acc, { coins }) => acc + coins, 0) + deposit
  const totalOutputTokens = aggregateTokenBundles(outputs.map(({ tokenBundle }) => tokenBundle))

  const additionalLovelaceAmount = outputs.reduce(
    (acc, { coins, tokenBundle }) => (tokenBundle.length > 0 ? acc + coins : acc),
    0
  )

  const feeWithoutChange = computeRequiredTxFee(
    inputs,
    outputs,
    certificates,
    withdrawals,
    auxiliaryData
  )

  const tokenDifference = getTokenBundlesDifference(totalInputTokens, totalOutputTokens)

  const isTokenDifferenceEmpty =
    tokenDifference.length === 0 || tokenDifference.every(({ quantity }) => quantity === 0)

  if (tokenDifference.some(({ quantity }) => quantity < 0)) {
    return {
      success: false,
      minimalLovelaceAmount: additionalLovelaceAmount,
      estimatedFee: feeWithoutChange,
      deposit,
      error: true,
    }
  }

  const remainingNoChangeLovelace = totalInput - totalOutput

  if (inputs.length === 0 || remainingNoChangeLovelace < 0) {
    return {
      success: false,
      minimalLovelaceAmount: additionalLovelaceAmount,
      estimatedFee: feeWithoutChange,
      deposit,
      error: { code: 3 },
    }
  }

  if (isTokenDifferenceEmpty && remainingNoChangeLovelace === 0) {
    return {
      success: true,
      txPlan: {
        inputs,
        outputs,
        change: [],
        certificates,
        deposit,
        additionalLovelaceAmount,
        fee: feeWithoutChange,
        baseFee: feeWithoutChange,
        withdrawals,
        auxiliaryData,
      },
    }
  }

  const adaOnlyChangeOutput: TxOutput = {
    isChange: false,
    address: possibleChange.address,
    coins: 0,
    tokenBundle: [],
  }

  const feeWithAdaOnlyChange = computeRequiredTxFee(
    inputs,
    [...outputs, adaOnlyChangeOutput],
    certificates,
    withdrawals,
    auxiliaryData
  )

  const remainingAdaOnlyChangeLovelace = totalInput - totalOutput - feeWithAdaOnlyChange

  if (isTokenDifferenceEmpty && remainingAdaOnlyChangeLovelace < MIN_UTXO_VALUE) {
    return {
      success: true,
      txPlan: {
        inputs,
        outputs,
        change: [],
        certificates,
        deposit,
        additionalLovelaceAmount,
        fee: totalInput - totalOutput,
        baseFee: feeWithoutChange,
        withdrawals,
        auxiliaryData,
      },
    }
  }

  if (isTokenDifferenceEmpty) {
    return {
      success: true,
      txPlan: {
        inputs,
        outputs,
        change: [{ ...adaOnlyChangeOutput, coins: remainingAdaOnlyChangeLovelace }],
        certificates,
        deposit,
        additionalLovelaceAmount,
        fee: feeWithAdaOnlyChange,
        baseFee: feeWithAdaOnlyChange,
        withdrawals,
        auxiliaryData,
      },
    }
  }

  const tokenChangeOutputs = createTokenChangeOutputs(
    possibleChange.address,
    tokenDifference,
    MAX_OUTPUT_TOKENS
  )

  const feeWithTokenChange = computeRequiredTxFee(
    inputs,
    [...outputs, ...tokenChangeOutputs],
    certificates,
    withdrawals,
    auxiliaryData
  )

  const remainingTokenChangeLovelace = totalInput - totalOutput

  if (remainingTokenChangeLovelace < 0) {
    return {
      success: false,
      minimalLovelaceAmount: additionalLovelaceAmount,
      estimatedFee: feeWithTokenChange,
      deposit,
      error: true,
    }
  }

  if (remainingTokenChangeLovelace > MIN_UTXO_VALUE) {
    const feeWithAdaAndTokenChange = computeRequiredTxFee(
      inputs,
      [...outputs, ...tokenChangeOutputs, adaOnlyChangeOutput],
      certificates,
      withdrawals,
      auxiliaryData
    )

    const adaOnlyChangeOutputLovelace =
      remainingTokenChangeLovelace - (feeWithAdaAndTokenChange - feeWithTokenChange)

    return {
      success: true,
      txPlan: {
        inputs,
        outputs,
        change: [
          { ...adaOnlyChangeOutput, coins: adaOnlyChangeOutputLovelace },
          ...tokenChangeOutputs,
        ],
        certificates,
        deposit,
        additionalLovelaceAmount,
        fee: feeWithAdaAndTokenChange,
        baseFee: feeWithAdaAndTokenChange,
        withdrawals,
        auxiliaryData,
      },
    }
  }

  const firstChangeOutput = {
    ...tokenChangeOutputs[0],
    coins: tokenChangeOutputs[0].coins + remainingTokenChangeLovelace,
  }

  return {
    success: true,
    txPlan: {
      inputs,
      outputs,
      change: tokenChangeOutputs.map((output, i) => (i === 0 ? firstChangeOutput : output)),
      certificates,
      deposit,
      additionalLovelaceAmount,
      fee: feeWithTokenChange,
      baseFee: feeWithTokenChange,
      withdrawals,
      auxiliaryData,
    },
  }
}

const selectMinimalTxPlan = (
  utxos: UTxO[],
  changeAddress: string,
  address: string,
  coins: number
): TxPlanResult | null => {
  const { outputs, certificates, withdrawals, auxiliaryData } = prepareTxPlanDraft(address, coins)

  const change: TxOutput = {
    isChange: false,
    address: changeAddress,
    coins: 0,
    tokenBundle: [],
  }

  let txPlanResult: TxPlanResult | null = null
  let numInputs = 0
  while (numInputs <= utxos.length) {
    const inputs = utxos.slice(0, numInputs)
    txPlanResult = validateTxPlan(
      computeTxPlan(inputs, outputs, change, certificates, withdrawals, auxiliaryData)
    )
    if (txPlanResult.success === true) {
      if (txPlanResult.txPlan.baseFee === txPlanResult.txPlan.fee || numInputs === utxos.length) {
        return txPlanResult
      }
    }
    numInputs += 1
  }

  return txPlanResult
}

const getNetworkFee = async (
  amount: number,
  addressFrom: string,
  addressTo: string,
  outputs: any[]
): Promise<TxPlanResult | null> => {
  const utxos = await formatUtxos(outputs, addressFrom)

  const arrangedUtxos = arrangeUtxos(utxos)

  return selectMinimalTxPlan(arrangedUtxos, addressFrom, addressTo, amount)
}

export default getNetworkFee

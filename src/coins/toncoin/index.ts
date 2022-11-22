import TonWeb from 'tonweb'
import { generateMnemonic, mnemonicToKeyPair } from 'tonweb-mnemonic'

// Utils
import { getTonAddressState } from '@utils/api'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig, TFeeProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

const nacl = TonWeb.utils.nacl
const BN = TonWeb.utils.BN

const RPC_URL = 'https://toncenter.com/api/v2/jsonRPC'

export const config: TCurrencyConfig = {
  coins: ['toncoin'],
  isInternalTx: true,
  extraIdName: 'Comment',
  isWithPhrase: true,
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const tonweb = new TonWeb(new TonWeb.HttpProvider())
  const mnemonic = await generateMnemonic()

  const privateKey = await wordsToPrivateKey(mnemonic)

  if (!privateKey) {
    return null
  }

  const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))

  const walletContract = new tonweb.wallet.all.v3R2(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
  })

  const getContractAddress = await walletContract.getAddress()

  const address = getContractAddress.toString(true, true, true)

  return {
    mnemonic: mnemonic.join(' '),
    address,
    privateKey,
  }
}

const wordsToPrivateKey = async (words: string[]): Promise<string | null> => {
  try {
    const keyPair = await mnemonicToKeyPair(words)

    return TonWeb.utils.bytesToBase64(keyPair.secretKey.slice(0, 32))
  } catch {
    return null
  }
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  const tonweb = new TonWeb(new TonWeb.HttpProvider())
  const privateKey = await wordsToPrivateKey(recoveryPhrase.split(' '))

  if (!privateKey) {
    return null
  }

  const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))

  const walletContract = new tonweb.wallet.all.v3R2(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
  })

  const getContractAddress = await walletContract.getAddress()

  const address = getContractAddress.toString(true, true, true)

  return {
    mnemonic: recoveryPhrase,
    address,
    privateKey,
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +TonWeb.utils.fromNano(value)
  }
  return +TonWeb.utils.toNano(value)
}

export const getExplorerLink = (address: string): string => {
  return `https://ton.sh/address/${address}`
}

export const getTransactionLink = (): string => {
  return ''
}

export const validateAddress = (address: string): boolean => {
  return TonWeb.Address.isValid(address)
}

const getHttpProvider = () => {
  return new TonWeb.HttpProvider(RPC_URL)
}

const getSeqNo = async (address: string): Promise<number> => {
  try {
    const ton = new TonWeb(getHttpProvider())
    const getWalletInfo = await ton.provider.getWalletInfo(address)

    return getWalletInfo?.seqno || 0
  } catch {
    return 0
  }
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  try {
    const { addressFrom, amount } = props
    const addressState = await getTonAddressState(addressFrom)

    if (addressState !== 'active') {
      return {
        networkFee: 0.010966001,
      }
    }

    const ton = new TonWeb(getHttpProvider())

    const seqno = await getSeqNo(addressFrom)
    const walletContract = new ton.wallet.all.v3R2(ton.provider, {
      address: addressFrom,
      wc: 0,
    })

    const query = walletContract.methods.transfer({
      secretKey: new Uint8Array(),
      toAddress: '',
      amount: formatValue(amount, 'to'),
      seqno,
      payload: '',
      sendMode: 3,
    })

    const estimateFee = await query.estimateFee()
    const { in_fwd_fee, storage_fee, gas_fee, fwd_fee } = estimateFee.source_fees
    const total = new BN(in_fwd_fee)
      .add(new BN(storage_fee))
      .add(new BN(gas_fee))
      .add(new BN(fwd_fee))

    return {
      networkFee: formatValue(+total, 'from'),
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
  extraId,
}: TInternalTxProps): Promise<string | null> => {
  if (!privateKey) {
    return null
  }

  const ton = new TonWeb(getHttpProvider())
  const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))

  const walletContract = new ton.wallet.all.v3R2(ton.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
  })
  const seqno = await getSeqNo(addressFrom)

  const query = walletContract.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: addressTo,
    amount: formatValue(amount, 'to'),
    seqno,
    payload: extraId,
    sendMode: 3,
  })

  const sendResponse = await query.send()

  const txHash = sendResponse['@extra']

  return txHash
}

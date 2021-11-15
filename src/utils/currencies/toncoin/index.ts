import TonWeb from 'tonweb'
import tonMnemonic from 'tonweb-mnemonic'

// Utils
import { getTonAddressState } from '@utils/api'

// Types
import { TInternalTxProps } from '../types'

const nacl = TonWeb.utils.nacl
const BN = TonWeb.utils.BN

const RPC_URL = 'https://toncenter.com/api/v2/jsonRPC'

export const coins: string[] = ['toncoin']
export const isInternalTx = true

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const tonweb = new TonWeb(new TonWeb.HttpProvider())
    const mnemonic = await tonMnemonic.generateMnemonic()
    const privateKey = await wordsToPrivateKey(mnemonic)
    const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))

    const walletClass = tonweb.wallet.all['v3R2']
    const walletContract = new walletClass(tonweb.provider, {
      publicKey: keyPair.publicKey,
      wc: 0,
    })

    const address = (await walletContract.getAddress()).toString(true, true, true)

    return {
      mnemonic: mnemonic.join(' '),
      address,
      privateKey,
    }
  } catch {
    return null
  }
}

const wordsToPrivateKey = async (words: string[]): Promise<string> => {
  const keyPair = await TonWeb.mnemonic.mnemonicToKeyPair(words)
  return TonWeb.utils.bytesToBase64(keyPair.secretKey.slice(0, 32))
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  try {
    const tonweb = new TonWeb(new TonWeb.HttpProvider())
    const walletClass = tonweb.wallet.all['v3R2']
    const privateKey = await wordsToPrivateKey(recoveryPhrase.split(' '))
    const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))
    const walletContract = new walletClass(tonweb.provider, {
      publicKey: keyPair.publicKey,
      wc: 0,
    })

    const address = (await walletContract.getAddress()).toString(true, true, true)

    return {
      mnemonic: recoveryPhrase,
      address,
      privateKey,
    }
  } catch {
    return null
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

export const getTransactionLink = (hash: string): string => {
  return ''
}

export const validateAddress = (address: string): boolean => {
  return TonWeb.Address.isValid(address)
}

const getSeqNo = async (address: string): Promise<number> => {
  try {
    const ton = new TonWeb(new TonWeb.HttpProvider(RPC_URL))
    const getWalletInfo = await ton.provider.getWalletInfo(address)

    return getWalletInfo?.seqno || 0
  } catch {
    return 0
  }
}

export const getNetworkFee = async (
  addressFrom: string,
  toAddress: string,
  amount: number
): Promise<number> => {
  try {
    const addressState = await getTonAddressState(addressFrom)

    if (addressState !== 'active') {
      return 0.010966001
    }

    const ton = new TonWeb(new TonWeb.HttpProvider(RPC_URL))

    const seqno = await getSeqNo(addressFrom)
    const WalletClass = ton.wallet.all['v3R2']
    const walletContract = new WalletClass(ton.provider, {
      address: addressFrom,
      wc: 0,
    })

    const query = walletContract.methods.transfer({
      secretKey: null,
      toAddress,
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

    return formatValue(total, 'from')
  } catch {
    return 0
  }
}

export interface SignKeyPair {
  publicKey: Uint8Array
  secretKey: Uint8Array
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  try {
    const ton = new TonWeb(new TonWeb.HttpProvider(RPC_URL))
    const keyPair = nacl.sign.keyPair.fromSeed(TonWeb.utils.base64ToBytes(privateKey))

    const WalletClass = ton.wallet.all['v3R2']
    const walletContract = new WalletClass(ton.provider, {
      publicKey: keyPair.publicKey,
      wc: 0,
    })
    const seqno = await getSeqNo(addressFrom)

    const query = walletContract.methods.transfer({
      secretKey: keyPair.secretKey,
      toAddress: addressTo,
      amount: formatValue(amount, 'to'),
      seqno,
      payload: '',
      sendMode: 3,
    })

    const sendResponse = await query.send()

    return sendResponse['@extra']
  } catch {
    return null
  }
}

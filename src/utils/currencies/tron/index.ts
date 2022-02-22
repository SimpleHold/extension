import TronWeb from 'tronweb'
import BigNumber from 'bignumber.js'

// Types
import { TAccount } from './types'
import { TInternalTxProps } from '../types'

let devKit: any = {}

const tronWeb: any = new Proxy({}, {
  get(target, key) {
    if (!(key in devKit)) {
      devKit = new TronWeb({ fullHost: 'https://api.trongrid.io' })
    }
    return devKit[key]
  }
})

export const coins: string[] = ['trx']
export const isInternalTx = true

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const account: TAccount = await tronWeb.createAccount()

    return {
      privateKey: account.privateKey,
      address: account.address.base58,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return tronWeb.address.fromPrivateKey(privateKey)
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://tronscan.org/#/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://tronscan.org/#/transaction/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return tronWeb.isAddress(address)
  } catch {
    return false
  }
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  try {
    const sendTrx = await tronWeb.transactionBuilder.sendTrx(
      addressTo,
      formatValue(amount, 'to'),
      addressFrom,
      1
    )
    const signedtxn = await tronWeb.trx.sign(sendTrx, privateKey)
    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn)

    if (receipt?.result) {
      return receipt.txid
    }

    return null
  } catch {
    return null
  }
}

export const getStandingFee = (): number => {
  return 1
}

import { Conflux, Drip, format, Transaction } from 'js-conflux-sdk'

// Types
import { TGetFeeData } from '../types'

const NETWORK_ID = 1029

const conflux = new Conflux({
  url: 'https://main.confluxrpc.com',
  networkId: NETWORK_ID,
})

export const coins: string[] = ['cfx']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    // @ts-ignore
    const { address, privateKey } = conflux.wallet.addRandom()

    return {
      address,
      privateKey,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    // @ts-ignore
    return conflux.wallet.addPrivateKey(privateKey).address
  } catch {
    return null
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +Drip.fromCFX(`${value}`).toString()
  }

  // @ts-ignore
  return +Drip(`${value}`).toCFX()
}

export const getExplorerLink = (address: string): string => {
  return `https://www.confluxscan.io/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://www.confluxscan.io/transaction/${hash}`
}

export const validateAddress = (address: string) => {
  try {
    format.hexAddress(address)

    return true
  } catch {
    return false
  }
}

export const createTransaction = async (
  from: string,
  to: string,
  amount: string,
  privateKey: string
): Promise<string | null> => {
  try {
    const value = Drip.fromCFX(amount)
    // @ts-ignore
    const estimate = await conflux.cfx.estimateGasAndCollateral({ to, value })

    const transaction = new Transaction({
      to,
      nonce: await conflux.getNextNonce(from),
      // @ts-ignore
      value,
      gas: estimate.gasUsed,
      gasPrice: await conflux.getGasPrice(),
      // @ts-ignore
      storageLimit: 0,
      epochHeight: await conflux.getEpochNumber(),
      chainId: NETWORK_ID,
      data: '0x',
    })

    transaction.sign(privateKey, NETWORK_ID)
    // @ts-ignore
    return await conflux.cfx.sendRawTransaction(transaction.serialize())
  } catch {
    return null
  }
}

export const getNetworkFee = async (): Promise<TGetFeeData> => {
  return {
    networkFee: 0.00021,
  }
}

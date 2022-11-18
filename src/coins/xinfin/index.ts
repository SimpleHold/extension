import Xdc3 from 'xdc3'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

const xdc3 = new Xdc3()
const chainId = 50
const provider = new Xdc3(new Xdc3.providers.HttpProvider('https://rpc.xinfin.network'))

export const config: TCurrencyConfig = {
  coins: ['xdc'],
  isInternalTx: true,
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const wallet = xdc3.eth.accounts.create()

  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return xdc3.eth.accounts.privateKeyToAccount(privateKey).address
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +xdc3.utils.fromWei(`${value}`, 'ether')
  }

  return +xdc3.utils.toWei(`${value}`, 'ether')
}

export const formatValueString = (value: string | number, type: 'from' | 'to'): string => {
  if (type === 'from') {
    return xdc3.utils.fromWei(`${value}`, 'ether')
  }

  return xdc3.utils.toWei(`${value}`, 'ether')
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.xinfin.network/addr/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.xinfin.network/tx/${hash}`
}

export const getNetworkFee = async (): Promise<TFeeResponse | null> => {
  try {
    const gasPrice = await provider.eth.getGasPrice()
    const fee = Number(gasPrice) * 21000

    return {
      networkFee: formatValue(fee, 'from'),
    }
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  return xdc3.utils.isAddress(address)
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  if (!privateKey) {
    return null
  }

  const nonce = await provider.eth.getTransactionCount(addressFrom)
  const gasPrice = await provider.eth.getGasPrice()

  const { rawTransaction } = await xdc3.eth.accounts.signTransaction(
    {
      to: addressTo,
      value: formatValueString(amount, 'to'),
      gas: 21000,
      chainId,
      gasPrice,
      nonce,
    },
    privateKey
  )

  if (rawTransaction) {
    const sendSignedTransaction = await provider.eth.sendSignedTransaction(rawTransaction)

    if (sendSignedTransaction) {
      return sendSignedTransaction.transactionHash
    }
  }

  return null
}

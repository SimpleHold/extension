import digibyteLib from 'digibyte-lib'
import { BigNumber } from 'bignumber.js'

// Utils
import { toLower } from '@utils/format'

// Types
import { TGetFeeData } from '../types'

export const coins: string[] = ['dgb']
export const isWithOutputs = true
const ten8 = new BigNumber(10).pow(8)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privateKey = new digibyteLib.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return new digibyteLib.PrivateKey(privateKey).toAddress().toString()
  } catch {
    return null
  }
}

export const getFee = (address: string, outputs: UnspentOutput[], amount: string): number => {
  try {
    return new digibyteLib.Transaction()
      .from(outputs)
      .to(address, formatValue(amount, 'to'))
      .change(address)
      .getFee()
  } catch {
    return 0
  }
}

export const getNetworkFee = (
  address: string,
  unspentOutputs: UnspentOutput[],
  amount: string
): TGetFeeData => {
  const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(address, utxos, amount)

    if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  const networkFee = formatValue(getFee(address, utxos, amount), 'from')

  return {
    networkFee,
    utxos,
  }
}

export const validateAddress = (address: string) => {
  try {
    const getAddress = new digibyteLib.Address.fromString(address)

    return toLower(getAddress.toString()) === toLower(address)
  } catch {
    return false
  }
}

export const createTransaction = (
  outputs: UnspentOutput[],
  to: string,
  amount: string,
  fee: number,
  changeAddress: string,
  privateKey: string
): string | null => {
  try {
    const transaction = new digibyteLib.Transaction()
      .from(outputs)
      .to(to, Number(amount))
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return transaction.toString()
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://digiexplorer.info/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://digiexplorer.info/tx/${hash}`
}

// Utils
import { toLower } from '@utils/format'

// Types
import { TCustomFees } from '@utils/currencies/types'
import { TFeeResponse } from '@utils/currencies/bitcoinLike/types'

export const coins: string[] = ['rvn']
export const isWithOutputs = true

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  const formatValue = Number(value)

  if (type === 'from') {
    return ravencore.Unit.fromSatoshis(formatValue).toBTC()
  }
  return ravencore.Unit.fromBTC(formatValue).toSatoshis()
}

export const generateWallet = () => {
  const privateKey = new ravencore.PrivateKey()
  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const importPrivateKey = (privateKey: string): string => {
  return new ravencore.PrivateKey(privateKey).toAddress().toString()
}

export const getExplorerLink = (address: string): string => {
  return `https://rvnblockexplorer.com/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://rvnblockexplorer.com/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    const getAddress = new ravencore.Address.fromString(address)
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
    const transaction = new ravencore.Transaction()
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

const getFeeType = (type: string): TFeeTypes => {
  if (type === 'slow') {
    return 'slow'
  }
  if (type === 'average') {
    return 'average'
  }
  return 'fast'
}

export const getFee = (address: string, outputs: UnspentOutput[], amount: string, feePerByte: number): number => {
  try {
    const txLength = new ravencore.Transaction()
      .from(outputs)
      .to(address, formatValue(amount, 'to'))
      .change(address)
      .toString()
      .length

    return txLength * feePerByte
  } catch {
    return 0
  }
}

export const getNetworkFee = (address: string, unspentOutputs: UnspentOutput[], amount: string): TFeeResponse | null => {

  const fees: TCustomFees[] = []
  const defaultFeePerKb = 1e7 // ravencore-lib default value
  const feesPerKb = {
    slow: defaultFeePerKb * 0.5,
    average: defaultFeePerKb,
    fast: defaultFeePerKb * 4
  }

  for (const type in feesPerKb) {
    const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
    const utxos: UnspentOutput[] = []

    const feeType = getFeeType(type)
    const feePerByte = feesPerKb[feeType] / 1e3

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = getFee(address, utxos, amount, feePerByte)
      if (getUtxosValue >= formatValue(Number(amount) + transactionFeeBytes, 'to')) {
        break
      }

      utxos.push(output)
    }

    const value = +formatValue(getFee(address, utxos, amount, feePerByte), 'from').toFixed(5)
    fees.push({
      type: feeType,
      utxos,
      value,
    })
  }

  const filterFees = fees.filter((fee: TCustomFees) => fee?.utxos?.length)

  return {
    fees: filterFees
  }
}


import neblioLib from 'neblio-lib'

// Utils
import { toLower } from '@utils/format'

export const coins = ['nebl']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privateKey = new neblioLib.PrivateKey()

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
    return new neblioLib.PrivateKey(privateKey).toAddress().toString()
  } catch {
    return null
  }
}

export const getFee = (address: string, outputs: UnspentOutput[], amount: string): number => {
  try {
    return new neblioLib.Transaction()
      .from(outputs)
      .to(address, formatValue(amount, 'to'))
      .change(address)
      .getFee()
  } catch {
    return 0
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  const formatValue = Number(value)

  if (type === 'from') {
    return neblioLib.Unit.fromSatoshis(formatValue).toBTC()
  }

  return neblioLib.Unit.fromBTC(formatValue).toSatoshis()
}

export const getNetworkFee = (address: string, unspentOutputs: UnspentOutput[], amount: string) => {
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
    const getAddress = new neblioLib.Address.fromString(address)

    return toLower(getAddress.toString()) === toLower(address)
  } catch {
    return false
  }
}

export const createTransaction = (
  outputs: UnspentOutput[],
  to: string,
  amount: number,
  fee: number,
  changeAddress: string,
  privateKey: string
): string | null => {
  try {
    const transaction = new neblioLib.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return transaction.toString()
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.nebl.io/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.nebl.io/tx/${hash}`
}

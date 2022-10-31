import digibyteLib from 'digibyte-lib'
import { BigNumber } from 'bignumber.js'

// Utils
import { toLower } from '@utils/format'

// Types
import {
  TGenerateAddress,
  TCurrencyConfig,
  TFeeProps,
  TUnspentOutput,
  TCreateTxProps,
} from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['dgb'],
  isWithOutputs: true,
}

const ten8 = new BigNumber(10).pow(8)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
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

export const getFee = (address: string, outputs: TUnspentOutput[], amount: string): number => {
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

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { outputs, from, amount } = props

  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: TUnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(from, utxos, amount)

    if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  const networkFee = formatValue(getFee(from, utxos, amount), 'from')

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

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  try {
    const { utxos, addressFrom, addressTo, amount, fee, privateKey } = props

    const transaction = new digibyteLib.Transaction()
      .from(utxos)
      .to(addressTo, Number(amount))
      .fee(fee)
      .change(addressFrom)
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

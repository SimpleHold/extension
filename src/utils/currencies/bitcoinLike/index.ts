// Types
import { TFeeResponse } from './types'
import { TCustomFee } from '@utils/api/types'
import { TCustomFees } from '../types'

export const coins = ['btc', 'bch', 'bsv', 'ltc', 'doge', 'dash']

const getProvider = (symbol: string): BitcoinLikeProvider | null => {
  if (symbol === 'btc' || symbol === 'bsv') {
    return bitcoin
  }

  if (symbol === 'bch') {
    return bitcoincash
  }

  if (symbol === 'dash') {
    return dash
  }

  if (symbol === 'doge') {
    return dogecoin
  }

  if (symbol === 'ltc') {
    return litecoin
  }

  return null
}

export const generateWallet = (symbol: string): TGenerateAddress | null => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.generateWallet()
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string, symbol: string): string | null => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.importPrivateKey(privateKey)
    }

    return null
  } catch {
    return null
  }
}

export const getFee = (
  address: string,
  outputs: UnspentOutput[],
  amount: string,
  feePerByte: number,
  symbol: string
): number => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.getFee(outputs, address, toSat(Number(amount)), address, feePerByte)
    }

    return 0
  } catch {
    return 0
  }
}

export const toSat = (value: number): number => {
  try {
    return bitcoin.toSat(value)
  } catch {
    return 0
  }
}

export const fromSat = (value: number): number => {
  try {
    return bitcoin.fromSat(value)
  } catch {
    return 0
  }
}

export const getNetworkFee = (
  address: string,
  outputs: UnspentOutput[],
  amount: string,
  feeValues: TCustomFee,
  symbol: string
): TFeeResponse | null => {
  try {
    const fees: TCustomFees[] = []

    for (const type in feeValues) {
      const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
      const utxos: UnspentOutput[] = []

      // @ts-ignore
      const getTypeValue = feeValues[type]

      for (const output of sortOutputs) {
        const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
        const transactionFeeBytes = getFee(address, utxos, amount, getTypeValue, symbol)

        if (getUtxosValue >= toSat(Number(amount)) + transactionFeeBytes) {
          break
        }

        utxos.push(output)
      }

      const value = fromSat(getFee(address, utxos, amount, getTypeValue, symbol))

      fees.push({
        // @ts-ignore
        type,
        utxos,
        value,
      })
    }

    const filterFees = fees.filter((fee: TCustomFees) => fee?.utxos?.length)

    return {
      fees: filterFees,
    }
  } catch {
    return null
  }
}

export const createTransaction = (
  outputs: UnspentOutput[],
  to: string,
  amount: number,
  fee: number,
  changeAddress: string,
  privateKey: string,
  symbol: string
): string | null => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.createTransaction(outputs, to, amount, fee, changeAddress, privateKey).raw
    }

    return null
  } catch {
    return null
  }
}

export const validateAddress = (address: string, symbol: string): boolean => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.isAddressValid(address)
    }

    return false
  } catch {
    return false
  }
}

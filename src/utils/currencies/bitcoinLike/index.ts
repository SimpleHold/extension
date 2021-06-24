// Utils
import { toLower } from '@utils/format'

export const chains: string[] = [
  'bitcoin',
  'bitcoin-cash',
  'bitcoin-sv',
  'litecoin',
  'dogecoin',
  'dash',
]
export const coins: string[] = ['btc', 'bch', 'bsv', 'ltc', 'doge', 'dash']

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

export const getFee = (
  address: string,
  outputs: UnspentOutput[],
  amount: string,
  symbol: string
): number => {
  try {
    const provider = getProvider(symbol)

    if (provider) {
      return provider.getFee(outputs, address, toSat(Number(amount)), address)
    }

    return 0
  } catch {
    return 0
  }
}

export const getNetworkFee = (
  address: string,
  unspentOutputs: UnspentOutput[],
  amount: string,
  symbol: string
) => {
  const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(address, utxos, amount, symbol)

    if (getUtxosValue >= toSat(Number(amount)) + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  const networkFee = fromSat(getFee(address, utxos, amount, symbol))

  return {
    networkFee: toLower(symbol) === 'doge' && networkFee < 1 ? 1 : networkFee,
    utxos,
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

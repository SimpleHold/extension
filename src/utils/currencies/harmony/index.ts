import { generatePrivateKey, getAddressFromPrivateKey, getAddress, BN } from '@harmony-js/crypto'
import { fromWei, Units, toWei, numToStr } from '@harmony-js/utils'

export const coins: string[] = ['one']
export const isInternalTx = true

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +fromWei(`${value}`, Units.one)
  }

  const expected = toWei(new BN(`${value}`), Units.one)
  return +numToStr(expected)
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const privateKey = generatePrivateKey()
    const address = getAddressFromPrivateKey(privateKey)

    return {
      privateKey,
      address: getAddress(address).bech32,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return getAddress(getAddressFromPrivateKey(privateKey)).bech32
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.harmony.one/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.harmony.one/tx/${hash}`
}

import BigNumber from 'bignumber.js'

const ten6 = new BigNumber(10).pow(6)

export const coins: string[] = ['zil']

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const privateKey = Zilliqa.schnorr.generatePrivateKey()
    const address = Zilliqa.getAddressFromPrivateKey(privateKey)

    return {
      privateKey,
      address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return Zilliqa.getAddressFromPrivateKey(privateKey)
  } catch {
    return null
  }
}

import BigNumber from 'bignumber.js'

export const coins: string[] = ['xvg']
export const isWithOutputs = true

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    return verge.generateWallet()
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return verge.importPrivateKey(privateKey)
  } catch {
    return null
  }
}

export const toSat = (value: number): number => {
  try {
    return verge.toSat(value)
  } catch {
    return 0
  }
}

export const fromSat = (value: number): number => {
  try {
    return verge.fromSat(value)
  } catch {
    return 0
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
    return verge.createTransaction(outputs, to, amount, fee, changeAddress, privateKey).raw
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    return verge.isAddressValid(address)
  } catch {
    return false
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://verge-blockchain.info/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://verge-blockchain.info/tx/${hash}`
}

export const getStandingFee = (): number => {
  return 0.1
}

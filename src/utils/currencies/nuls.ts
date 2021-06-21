import nuls from 'nuls-sdk-js'
import BigNumber from 'bignumber.js'

export const coins: string[] = ['nuls']
const chainId = 1

const ten8 = new BigNumber(10).pow(8)

export const toNuls = (value: string | number): number => {
  return Number(new BigNumber(value).div(ten8))
}

export const fromNuls = (value: string | number): number => {
  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const { address, pri: privateKey } = nuls.newAddress(chainId, '', '')

    if (address && privateKey) {
      return {
        address,
        privateKey,
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const importByKey = nuls.importByKey(chainId, privateKey, '', '')

    if (importByKey?.address) {
      return importByKey.address
    }

    return null
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    const verify = nuls.verifyAddress(address)
    return verify.chainId === chainId && verify.right
  } catch {
    return false
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://nulscan.io/address/info?address=${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://nulscan.io/transaction/info?hash=${hash}`
}

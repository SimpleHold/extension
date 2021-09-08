import BigNumber from 'bignumber.js'
import { PrivateKey } from '@hashgraph/sdk'

// Utils
import { activateAccount } from '@utils/api'

export const coins: string[] = ['hbar']

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const newKey = PrivateKey.generate()

    const getAddress = await activateAccount('hedera', `${newKey.publicKey}`)

    if (getAddress) {
      return {
        address: getAddress,
        privateKey: `${newKey}`,
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return '' // Fix me
  } catch {
    return null
  }
}

import * as solanaWeb3 from '@solana/web3.js'
import BigNumber from 'bignumber.js'

const ten6 = new BigNumber(10).pow(6)

export const coins: string[] = ['sol']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const generate = solanaWeb3.Keypair.generate()

    return {
      address: generate.publicKey.toString(),
      privateKey: generate.secretKey.toString(),
    }
  } catch {
    return null
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

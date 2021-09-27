import * as solanaWeb3 from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import bs58 from 'bs58'

// Types
import { TInternalTxProps } from '../types'

const ten9 = new BigNumber(10).pow(9)

export const coins: string[] = ['sol']
export const isInternalTx = true

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const generate = solanaWeb3.Keypair.generate()

    return {
      address: generate.publicKey.toString(),
      privateKey: JSON.stringify(Array.from(generate.secretKey)),
    }
  } catch {
    return null
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten9))
  }

  return Number(new BigNumber(value).multipliedBy(ten9))
}

const getKeypairFromPrivateKey = (privateKey: string): solanaWeb3.Keypair | null => {
  try {
    return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)))
  } catch {
    try {
      return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)))
    } catch {
      return null
    }
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const keyPair = getKeypairFromPrivateKey(privateKey)

    if (keyPair) {
      return keyPair.publicKey.toString()
    }

    return null
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.solana.com/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.solana.com/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    new solanaWeb3.PublicKey(address)
    return true
  } catch {
    return false
  }
}

const addressToPubKey = (address: string): solanaWeb3.PublicKey => {
  return new solanaWeb3.PublicKey(address)
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  try {
    const keyPair = getKeypairFromPrivateKey(privateKey)

    if (keyPair) {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
      )

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: addressToPubKey(addressFrom),
          toPubkey: addressToPubKey(addressTo),
          lamports: formatValue(amount, 'to'),
        })
      )

      return await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [keyPair])
    }

    return null
  } catch {
    return null
  }
}

export const getStandingFee = (): number => {
  return 0.000005
}

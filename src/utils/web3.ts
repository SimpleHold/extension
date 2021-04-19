import Web3 from 'web3'

import config from '@config/index'

const web3 = new Web3()

export type Unit =
  | 'noether'
  | 'wei'
  | 'kwei'
  | 'Kwei'
  | 'babbage'
  | 'femtoether'
  | 'mwei'
  | 'Mwei'
  | 'lovelace'
  | 'picoether'
  | 'gwei'
  | 'Gwei'
  | 'shannon'
  | 'nanoether'
  | 'nano'
  | 'szabo'
  | 'microether'
  | 'micro'
  | 'finney'
  | 'milliether'
  | 'milli'
  | 'ether'
  | 'kether'
  | 'grand'
  | 'mether'
  | 'gether'
  | 'tether'

export const generateAddress = (): TGenerateAddress | null => {
  try {
    const item = web3.eth.accounts.create()

    return {
      privateKey: item.privateKey,
      address: item.address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey).address
  } catch {
    return null
  }
}

export const fromWei = (value: string, unit: Unit): number => {
  return +web3.utils.fromWei(value, unit)
}

export const toWei = (value: string, unit: Unit): number => {
  return +web3.utils.toWei(value, unit)
}

export const createTransaction = async (
  to: string,
  amount: number,
  gas: number,
  chainId: number,
  gasPrice: string,
  nonce: number,
  privateKey: string
): Promise<TCreatedTransaction | null> => {
  try {
    const value = web3.utils.toWei(`${amount}`, 'ether')

    const { rawTransaction, transactionHash } = await web3.eth.accounts.signTransaction(
      {
        to,
        value,
        gas,
        chainId,
        gasPrice,
        nonce,
      },
      privateKey
    )

    if (rawTransaction && transactionHash) {
      return {
        raw: rawTransaction,
        hash: transactionHash,
      }
    }

    return null
  } catch {
    return null
  }
}

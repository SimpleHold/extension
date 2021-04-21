import Web3 from 'web3'

import contractABI from '@config/contractABI'
import { getToken } from '@config/tokens'

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

interface TransferTokenOptions {
  amount: number
  chain: string
  symbol: string
  from: string
  to: string
  privateKey: string
  gasPrice: string
  gas: string
  nonce: number
  chainId: number
  contractAddress?: string
}

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
  value: number,
  gas: number,
  chainId: number,
  gasPrice: string,
  nonce: number,
  privateKey: string
): Promise<TCreatedTransaction | null> => {
  try {
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

export const transferToken = async ({
  amount,
  chain,
  symbol,
  from,
  to,
  privateKey,
  gasPrice,
  gas,
  nonce,
  chainId,
  contractAddress,
}: TransferTokenOptions): Promise<TCreatedTransaction | null> => {
  try {
    const decimals = 18
    const value = web3.utils
      .toBN(10)
      .pow(web3.utils.toBN(decimals))
      .mul(web3.utils.toBN(amount))
      .toString()

    const getContractAddress = getToken(symbol, chain)?.address || contractAddress

    const contract = new web3.eth.Contract(contractABI, getContractAddress, { from })
    const data = contract.methods.transfer(to, value)

    const { rawTransaction, transactionHash } = await web3.eth.accounts.signTransaction(
      {
        to: getContractAddress,
        gasPrice,
        gas,
        data: data.encodeABI(),
        nonce,
        chainId,
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

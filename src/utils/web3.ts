import Web3 from 'web3'

import contractABI from '@config/contractABI'

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
  value: string
  from: string
  to: string
  privateKey: string
  gasPrice: string
  gas: number
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

export const convertDecimals = (value: string | number, decimals: number): number => {
  return +web3.utils
    .toBN(web3.utils.toWei(`${value}`, 'ether'))
    .div(
      web3.utils.toBN(
        `1${Array(18 - decimals)
          .fill(0)
          .join()
          .replace(/,/g, '')}`
      )
    )
    .toString()
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
  value,
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
    const contract = new web3.eth.Contract(contractABI, contractAddress, { from })
    const data = contract.methods.transfer(to, value)

    const { rawTransaction, transactionHash } = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
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

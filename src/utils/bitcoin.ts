import bitcore from 'bitcore-lib'
import axios, { AxiosResponse } from 'axios'

import { validateBitcoinPrivateKey } from '@utils/validate'

export interface IUnspentOutput {
  tx_hash_big_endian: string
  tx_hash: string
  tx_output_n: number
  script: string
  value: number
  value_hex: string
  confirmations: number
  tx_index: number
}

export const generateWallet = () => {
  const privateKey = new bitcore.PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const getBalance = (address: string): Promise<number> | number => {
  try {
    return fetch(`https://blockchain.info/balance?active=${address}`)
      .then((response) => response.json())
      .then((data) => {
        return data[address].final_balance / 100000000
      })
  } catch {
    return 0
  }
}

export const getEstimated = (amount: number): Promise<number> | number => {
  try {
    if (amount === 0) {
      return 0
    }
    return fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then((response) => response.json())
      .then((data) => {
        return data['USD'] * amount
      })
  } catch {
    return 0
  }
}

export const importAddress = (privateKey: string) => {
  try {
    if (validateBitcoinPrivateKey(privateKey)) {
      return new bitcore.PrivateKey(privateKey).toAddress().toString()
    }
    return null
  } catch {
    return null
  }
}

export const getUnspentOutputs = async (
  address: string
): Promise<AxiosResponse<IUnspentOutput[]> | []> => {
  try {
    const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}`)

    return data?.unspent_outputs
  } catch {
    return []
  }
}

export const createTransaction = (
  outputs: bitcore.Transaction.UnspentOutput[],
  to: string,
  amount: number,
  privateKey: string,
  changeAddress: string
) => {
  return new bitcore.Transaction()
    .from(outputs)
    .to(to, amount)
    .change(changeAddress)
    .sign(privateKey)
    .serialize()
}

export const getTransactionFeeBytes = (outputs: bitcore.Transaction.UnspentOutput[]): number => {
  try {
    return new bitcore.Transaction().from(outputs).toString().length
  } catch {
    return 0
  }
}

export const sendTransaction = (transaction: string) => {}

export const getFees = async (): Promise<AxiosResponse<number> | number> => {
  try {
    const { data } = await axios.get('https://api.blockchain.info/mempool/fees')

    return data.regular
  } catch {
    return 0
  }
}

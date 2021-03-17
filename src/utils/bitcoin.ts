import { Transaction, Unit } from 'bitcore-lib'
import axios, { AxiosResponse } from 'axios'

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

export interface IRawTransaction {
  hash: string
  raw: string
}

interface IGetBalance {
  balance: number
  usd: number
}

export const getBalance = async (address: string, chain: string): Promise<IGetBalance> => {
  try {
    const { data }: AxiosResponse = await axios(
      `http://localhost:8080/wallet/balance/${chain}/${address}`
    )
    const { balance, usd } = data.data

    return {
      balance,
      usd,
    }
  } catch {
    return {
      balance: 0,
      usd: 0,
    }
  }
}

export const getUnspentOutputs = async (address: string): Promise<IUnspentOutput[]> => {
  try {
    const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}`)

    return data?.unspent_outputs
  } catch {
    return []
  }
}

export const sendRawTransaction = async (transaction: string): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      'https://btc.getblock.io',
      {
        jsonrpc: '2.0',
        id: +new Date(),
        method: 'sendrawtransaction',
        params: [transaction],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '51cbe972-73ce-4b49-a602-651ee065dd3f',
        },
      }
    )

    return data?.result || null
  } catch {
    return null
  }
}

export const getFees = async (): Promise<number> => {
  try {
    const { data } = await axios.get('https://api.blockchain.info/mempool/fees')

    return data.regular || 0
  } catch {
    return 0
  }
}

export const createTransaction = (
  outputs: Transaction.UnspentOutput[],
  to: string,
  amount: number,
  fee: number,
  changeAddress: string,
  privateKey: string
) => {
  try {
    const transaction = new Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return {
      raw: transaction.serialize(),
      hash: transaction.hash,
    }
  } catch {
    return null
  }
}

export const getTransactionSize = (outputs: Transaction.UnspentOutput[]) => {
  try {
    return new Transaction().from(outputs).toString().length
  } catch {
    return 0
  }
}

export const btcToSat = (value: number) => {
  return Unit.fromBTC(value).toSatoshis()
}

export const satToBtc = (value: number) => {
  return Unit.fromSatoshis(value).toBTC()
}

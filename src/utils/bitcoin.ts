import { Transaction, Unit } from 'bitcore-lib'
import axios, { AxiosResponse } from 'axios'

// Config
import config from '@config/index'

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
      `${config.serverUrl}/wallet/balance/${chain}/${address}`
    )
    const { balance, balance_usd } = data.data

    return {
      balance,
      usd: balance_usd,
    }
  } catch {
    return {
      balance: 0,
      usd: 0,
    }
  }
}

export const getUnspentOutputs = async (
  address: string,
  chain: string
): Promise<Transaction.UnspentOutput[]> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/wallet/unspent/${chain}/${address}`)

    return data?.data
  } catch {
    return []
  }
}

export const sendRawTransaction = async (
  transaction: string,
  currency: string
): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      `${config.serverUrl}/transaction/send`,
      {
        currency,
        transaction,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return data?.data || null
  } catch {
    return null
  }
}

export const getFees = async (chain: string): Promise<number> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/wallet/fee/${chain}`)

    return data.data || 0
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

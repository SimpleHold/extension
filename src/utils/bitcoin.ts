import axios from 'axios'

import config from '@config/index'

export interface IRawTransaction {
  hash: string
  raw: string
}

export interface IBitcoreUnspentOutput {
  address: string
  txId: string
  outputIndex: number
  script: string
  satoshis: number
}

export type TGetBalanceResponse = {
  balance: number
  balance_usd: number
}

export const getBalance = async (address: string): Promise<TGetBalanceResponse | null> => {
  try {
    const { data } = await axios(`${config.api}/wallet/balance/bitcoin/${address}`)

    return data.data
  } catch {
    return null
  }
}

export const getUnspentOutputs = async (address: string): Promise<IBitcoreUnspentOutput[]> => {
  try {
    const { data } = await axios(`${config.api}/wallet/unspent/bitcoin/${address}`)

    return data.data
  } catch {
    return []
  }
}

export const sendRawTransaction = async (transaction: string): Promise<string | null> => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: `${config.api}/transaction/send`,
      data: {
        currency: 'btc',
        transaction,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return null
  }
}

export const getFees = async (): Promise<number> => {
  try {
    const { data } = await axios.get(`${config.api}/wallet/fee/bitcoin`)

    return data.data || 0
  } catch {
    return 0
  }
}

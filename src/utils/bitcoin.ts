import axios, { AxiosResponse } from 'axios'

// Config
import config from '@config/index'

export interface IRawTransaction {
  hash: string
  raw: string
}

interface IGetBalance {
  balance: number
  balance_usd: number
  balance_btc: number
  pending: number
  pending_btc: number
}

export const getBalance = async (address: string, chain: string): Promise<IGetBalance> => {
  try {
    const { data }: AxiosResponse = await axios(
      `${config.serverUrl}/wallet/balance/${chain}/${address}`
    )
    return data.data
  } catch {
    return {
      balance: 0,
      balance_usd: 0,
      balance_btc: 0,
      pending: 0,
      pending_btc: 0,
    }
  }
}

export const getEstimated = async (
  value: number,
  currencyFrom: string,
  currencyTo: string
): Promise<number> => {
  try {
    const { data }: AxiosResponse = await axios({
      method: 'GET',
      url: `${config.serverUrl}/wallet/estimated`,
      params: {
        value,
        currencyFrom,
        currencyTo,
      },
    })

    return data.data
  } catch {
    return 0
  }
}

export const getUnspentOutputs = async (address: string, chain: string): Promise<any[]> => {
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

export const btcToSat = (value: number) => {
  return 0 //Unit.fromBTC(value).toSatoshis()
}

export const satToBtc = (value: number) => {
  return 0 // Unit.fromSatoshis(value).toBTC()
}

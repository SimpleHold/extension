import axios, { AxiosResponse } from 'axios'

// Config
import config from '@config/index'

import {
  IGetBalance,
  IGetContractInfo,
  ITokensBalance,
  Web3TxParams,
  IGetNetworkFeeResponse,
  IAdaTrParams,
  TPhishingSite,
  TAddressTx,
  TCustomFee,
} from './types'

export const getBalance = async (
  address: string,
  chain?: string,
  tokenSymbol?: string,
  contractAddress?: string
): Promise<IGetBalance> => {
  try {
    const { data }: AxiosResponse = await axios(
      `${config.serverUrl}/wallet/balance/${chain}/${address}`,
      {
        params: {
          tokenSymbol,
          contractAddress,
        },
      }
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
  currency?: string
): Promise<string | null> => {
  try {
    if (currency) {
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
    }
    return null
  } catch {
    return null
  }
}

export const getContractInfo = async (
  address: string,
  chain: string
): Promise<IGetContractInfo | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/contract/${chain}/${address}`)

    return data.data
  } catch {
    return null
  }
}

export const getTokensBalance = async (
  address: string,
  chain: string
): Promise<ITokensBalance[] | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/contract/balances`, {
      params: {
        address,
        chain,
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

export const getWeb3TxParams = async (
  from: string,
  to: string,
  value: number,
  chain?: string,
  contractAddress?: string
): Promise<Web3TxParams | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/eth-like/params`, {
      params: {
        from,
        to,
        value,
        chain,
        contractAddress,
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

export const getEtherNetworkFee = async (
  from: string,
  to: string,
  value: number,
  chain: string,
  tokenSymbol?: string,
  contractAddress?: string,
  decimals?: number
): Promise<IGetNetworkFeeResponse> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/eth-like/smart-network-fee`, {
      params: {
        from,
        to,
        value,
        chain,
        tokenSymbol,
        contractAddress,
        decimals,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const getThetaNetworkFee = async (address: string): Promise<IGetNetworkFeeResponse> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/theta/network-fee`, {
      params: {
        address,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return {
      networkFee: 0.3,
    }
  }
}

export const getCardanoTransactionParams = async (): Promise<IAdaTrParams | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/cardano/params`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch {
    return null
  }
}

export const getNetworkFee = async (type: string): Promise<IGetNetworkFeeResponse | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/${type}/network-fee`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return null
  }
}

export const getXrpTxParams = async (from: string) => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/ripple/params`, {
      params: {
        from,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch {
    return null
  }
}

export const getTxHex = async (chain: string, txId: string): Promise<null | string> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/tx-hex/${chain}/${txId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return null
  }
}

export const getPhishingSites = async (): Promise<TPhishingSite[] | null> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/phishing-sites`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data
  } catch {
    return null
  }
}

export const getNulsTxParams = async (from: string) => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/nuls/params`, {
      params: {
        from,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch {
    return null
  }
}

export const getTransactionHistory = async (
  chain: string,
  address: string,
  tokenSymbol?: string,
  contractAddress?: string
): Promise<string[]> => {
  try {
    const { data } = await axios.get(`${config.serverUrl}/transaction/${chain}/history`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        address,
        tokenSymbol,
        contractAddress,
      },
    })

    return data.data
  } catch {
    return []
  }
}

export const getTxsInfo = async (
  chain: string,
  address: string,
  txs: string[]
): Promise<TAddressTx[]> => {
  try {
    const { data } = await axios.post(
      `${config.serverUrl}/transaction/${chain}/info`,
      {
        txs,
        address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return data.data
  } catch {
    return []
  }
}

export const getCustomFee = async (chain: string): Promise<TCustomFee | null> => {
  try {
    const { data }: AxiosResponse = await axios.get(`${config.serverUrl}/fee/${chain}`)

    return data.data
  } catch {
    return null
  }
}

export const setUserId = async (userid: string): Promise<void> => {
  try {
    await axios.post(`${config.serverUrl}/satismeter/users/new`, {
      userid,
    })
  } catch {}
}

export const sendFeedback = async (
  userId: string,
  feedback: string,
  rating: number
): Promise<void> => {
  try {
    await axios.post(`${config.serverUrl}/satismeter/feedback`, {
      userId,
      feedback,
      rating,
    })
  } catch {}
}

import axios, { AxiosResponse } from 'axios'
import bcryptjs from 'bcryptjs'

// Config
import config from '@config/index'
import { defaultFeeRate } from './data'

// Types
import {
  IGetBalances,
  IGetContractInfo,
  IGetNetworkFeeResponse,
  ITokensBalance,
  TFullTxWallet,
  TGetBalancesWalletProps,
  TNft,
  TNFtWallets,
  TPhishingSite,
  TTonAddressState,
  TTxWallet,
  TVetTxParams,
  Web3TxParams,
  TRequestParams,
  TResponse,
  TFeeRate,
  TCardanoAsset,
  TFeeResponse,
} from './types'
import { TUnspentOutput } from '@coins/types'

export const sendRequest = async <T, D = {}>({
  url,
  method = 'GET',
  data,
  params,
  skipNestedData,
  timeout = 0,
}: TRequestParams<D>): Promise<T | null> => {
  try {
    const { data: responseData }: AxiosResponse<TResponse<T>> = await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data,
      params,
      timeout: timeout,
    })

    if (skipNestedData) {
      // @ts-ignore
      return responseData
    }

    return responseData.data
  } catch {
    return null
  }
}

const getHash = async (): Promise<string> => {
  return await bcryptjs.hash(`${process.env.REQUEST_BCRYPT_VALUE}`, 10)
}

export const fetchBalances = async (
  wallets: TGetBalancesWalletProps[]
): Promise<IGetBalances[]> => {
  const request = await sendRequest<IGetBalances[]>({
    url: `${config.serverUrl}/wallet/balances`,
    method: 'POST',
    data: {
      wallets,
      // hash: await getHash(),
    },
    timeout: 180000,
  })

  return request || []
}

export const getEstimated = async (
  value: number,
  currencyFrom: string,
  currencyTo: string
): Promise<number> => {
  const request = await sendRequest<number>({
    url: `${config.serverUrl}/wallet/estimated`,
    params: {
      value,
      currencyFrom,
      currencyTo,
    },
  })

  return request || 0
}

export const getUnspentOutputs = async (
  address: string,
  chain: string
): Promise<TUnspentOutput[]> => {
  const request = await sendRequest<TUnspentOutput[]>({
    url: `${config.serverUrl}/wallet/unspent/${chain}/${address}`,
  })

  return request || []
}

export const sendRawTransaction = async (
  transaction: string,
  currency?: string,
  data?: any
): Promise<string | null> => {
  return await sendRequest<string>({
    url: `${config.serverUrl}/transaction/send`,
    method: 'POST',
    data: {
      currency,
      transaction,
      data,
    },
  })
}

export const getContractInfo = async (
  address: string,
  chain: string
): Promise<IGetContractInfo | null> => {
  return await sendRequest<IGetContractInfo>({
    url: `${config.serverUrl}/contract/${chain}/${address}`,
  })
}

export const getTokensBalance = async (
  address: string,
  chain: string
): Promise<ITokensBalance[] | null> => {
  return await sendRequest<ITokensBalance[]>({
    url: `${config.serverUrl}/contract/balances`,
    params: {
      address,
      chain,
    },
  })
}

export const getWeb3TxParams = async (
  from: string,
  to: string,
  value: string,
  chain?: string,
  contractAddress?: string
): Promise<Web3TxParams | null> => {
  return await sendRequest<Web3TxParams>({
    url: `${config.serverUrl}/transaction/eth-like/params`,
    params: {
      from,
      to,
      value,
      chain,
      contractAddress,
    },
  })
}

export const getEtherNetworkFee = async (
  from: string,
  to: string,
  value: string,
  chain: string,
  tokenSymbol?: string,
  contractAddress?: string,
  decimals?: number
): Promise<IGetNetworkFeeResponse> => {
  const request = await sendRequest<IGetNetworkFeeResponse>({
    url: `${config.serverUrl}/transaction/eth-like/smart-network-fee`,
    params: {
      from,
      to,
      value,
      chain,
      tokenSymbol,
      contractAddress,
      decimals,
    },
  })

  return (
    request || {
      networkFee: 0,
    }
  )
}

export const getNetworkFee = async (type: string): Promise<IGetNetworkFeeResponse | null> => {
  return await sendRequest<IGetNetworkFeeResponse>({
    url: `${config.serverUrl}/transaction/${type}/network-fee`,
  })
}

export const getXrpTxParams = async (from: string): Promise<any> => {
  return await sendRequest<any>({
    url: `${config.serverUrl}/transaction/ripple/params`,
    params: {
      from,
    },
  })
}

export const getTxHex = async (chain: string, txId: string): Promise<null | string> => {
  return await sendRequest<string>({
    url: `${config.serverUrl}/transaction/tx-hex/${chain}/${txId}`,
  })
}

export const getPhishingSites = async (): Promise<TPhishingSite[] | null> => {
  return await sendRequest<TPhishingSite[]>({
    url: `${config.serverUrl}/phishing-sites`,
  })
}

export const setUserId = async (userid: string): Promise<void> => {
  await sendRequest<any>({
    url: `${config.serverUrl}/satismeter/users/new`,
    method: 'POST',
    data: {
      userid,
    },
  })
}

export const sendFeedback = async (
  userId: string,
  feedback: string,
  rating: number
): Promise<void> => {
  await sendRequest<any>({
    url: `${config.serverUrl}/satismeter/feedback`,
    method: 'POST',
    data: {
      userId,
      feedback,
      rating,
    },
  })
}

export const getWarning = async (symbol: string, chain?: string): Promise<string | null> => {
  return await sendRequest<string>({
    url: `${config.serverUrl}/wallet/warning`,
    params: {
      symbol,
      chain,
    },
  })
}

export const fetchFullTxHistory = async (wallets: TTxWallet[]): Promise<TFullTxWallet[]> => {
  const request = await sendRequest<TFullTxWallet[]>({
    url: `${config.serverUrl}/transaction/transactions-full-info`,
    method: 'POST',
    data: {
      wallets,
      // hash: await getHash(),
    },
    timeout: 240000,
  })

  return request || []
}

export const activateAccount = async <T>(chain: string, publicKey: string): Promise<T | null> => {
  return await sendRequest<T>({
    url: `${config.serverUrl}/wallet/activate`,
    method: 'POST',
    data: {
      chain,
      publicKey,
    },
  })
}

export const getHederaAccountId = async (publicKey: string): Promise<string | null> => {
  return await sendRequest<string>({
    url: `${config.serverUrl}/wallet/hedera/accountId`,
    params: {
      publicKey,
    },
  })
}

export const getNft = async (wallets: TNFtWallets[]): Promise<TNft[]> => {
  const request = await sendRequest<TNft[]>({
    url: `${config.serverUrl}/nft`,
    method: 'POST',
    data: {
      wallets,
    },
  })

  return request || []
}

export const getVechainParams = async (): Promise<TVetTxParams | null> => {
  return await sendRequest<TVetTxParams>({
    url: `${config.serverUrl}/transaction/vechain/params`,
    skipNestedData: true,
  })
}

export const getVechainFee = async (from: string, to: string, value: string): Promise<number> => {
  const request = await sendRequest<number>({
    url: `${config.serverUrl}/transaction/vechain/network-fee`,
    params: {
      from,
      to,
      value,
    },
  })

  return request || 0
}

export const getTonAddressState = async (address: string): Promise<TTonAddressState> => {
  try {
    const request = await sendRequest<TTonAddressState>({
      url: 'https://api.ton.sh/getAddressState',
      params: {
        address,
      },
    })

    return request || 'uninitialized'
  } catch {
    return 'uninitialized'
  }
}

export const sendNanoRpcRequest = async <T>(input: any): Promise<T | null> => {
  return await sendRequest<T>({
    url: `${config.serverUrl}/rpc/nano`,
    method: 'POST',
    data: {
      input,
    },
  })
}

export const getNanoPow = async (hash: string, type: string): Promise<string | null> => {
  return await sendRequest<string>({
    url: `${config.serverUrl}/rpc/nano/pow`,
    method: 'POST',
    data: {
      input: {
        hash,
        type,
      },
    },
  })
}

export const getTxParams = async (
  type: string,
  from?: string,
  to?: string,
  value?: string,
  chain?: string,
  contractAddress?: string
): Promise<any> => {
  return await sendRequest({
    url: `${config.serverUrl}/transaction/${type}/params`,
    params: {
      from,
      to,
      chain,
      value,
      contractAddress,
    },
    skipNestedData: type !== 'eth-like',
  })
}

export const getFeeRate = async (chain: string): Promise<TFeeRate> => {
  try {
    const request = await sendRequest<TFeeRate | null>({
      url: `${config.serverUrl}/fee/${chain}`,
    })

    return request || defaultFeeRate
  } catch {
    return defaultFeeRate
  }
}

export const getCardanoAsset = async (asset: string): Promise<TCardanoAsset | null> => {
  try {
    return await sendRequest<TCardanoAsset>({
      url: `${config.serverUrl}/wallet/cardano/assetInfo`,
      params: {
        asset,
      },
    })
  } catch {
    return null
  }
}

export const getNetworkFeeRequest = async (
  chain: string,
  address?: string,
  value?: string,
  extraId?: string
): Promise<TFeeResponse | null> => {
  try {
    return await sendRequest<TFeeResponse>({
      url: `${config.serverUrl}/transaction/${chain}/network-fee`,
      params: {
        address,
        value,
        extraId,
      },
    })
  } catch {
    return {
      networkFee: 0.3,
    }
  }
}

export const getAddressNonce = async (chain: string, address: string): Promise<string> => {
  const request = await sendRequest<string>({
    url: `${config.serverUrl}/wallet/nonce/${chain}`,
    method: 'GET',
    params: {
      address,
    },
  })

  return request || '0'
}

export const getOutputs = async (
  address: string,
  chain: string,
  contractAddress?: string
): Promise<TUnspentOutput[]> => {
  try {
    const url = chain === 'cardano' ? 'unspent/v2' : 'unspent'

    const request = await sendRequest<TUnspentOutput[] | null>({
      url: `${config.serverUrl}/wallet/${url}/${chain}/${address}`,
      params: {
        contractAddress,
      },
    })

    return request || []
  } catch {
    return []
  }
}

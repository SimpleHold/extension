// Utils
import { ICardanoUnspentTxOutput } from '@utils/currencies/cardano'

export interface IGetBalance {
  balance: number
  balance_usd: number
  balance_btc: number
  pending: number
  pending_btc: number
}

export interface IGetContractInfo {
  decimals: number
  name: string
  symbol: string
}

export interface ITokensBalance {
  address: string
  symbol: string
}

export interface Web3TxParams {
  chainId: number
  nonce: number
  gas: number
  gasPrice: string
}

export interface IGetNetworkFeeResponse {
  networkFee?: number
  networkFeeLabel?: string
  utxos?: UnspentOutput[] | ICardanoUnspentTxOutput[]
  chainId?: number
  gas?: number
  gasPrice?: string
  nonce?: number
  currencyBalance?: number
}

export interface IAdaTrParams {
  ttl: number
}

export type TPhishingSite = {
  url: string
  rightUrl: string
  name: string
  favicon: string
}

export type TAddressTx = {
  type: 'spend' | 'received'
  date: string
  destination: string
  amount: number
  estimated: number
}

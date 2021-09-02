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
  utxos?: UnspentOutput[] | CardanoUnspentTxOutput[]
  chainId?: number
  gas?: number
  gasPrice?: string
  nonce?: number
  currencyBalance?: number
  fees?: {
    type: TFeeTypes
    value: number
  }[]
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
  isPending: boolean
  date: string
  hash: string
  amount: number
  estimated: number
}

export type TCustomFee = {
  slow: number
  average: number
  fast: number
}

export type TTxWallet = {
  chain: string
  address: string
  tokenSymbol?: string
  contractAddress?: string
}

export type THistoryTx = {
  fee: number
  feeEstimated: number
  addressFrom?: string
  addressTo?: string
  date: string
  isPending: boolean
  amount: number
  estimated: number
  addressesFrom?: TTxHistoryAddress[]
  addressesTo?: TTxHistoryAddress[]
}

export type TTxHistoryAddress = {
  address: string
  amount: number
  estimated: number
}

export type TTxAddressItem = {
  chain: string
  address: string
  txs: string[]
  tokenSymbol?: string
  contractAddress?: string
}

export type TFullTxHistoryResponse = {
  error: boolean
  data?: TTxAddressItem[]
}

export type TFullTxWallet = {
  chain: string
  address: string
  txs: string[]
}

export type TFullTxInfo = {
  hash: string
  amount: number
  estimated: number
  chain: string
  address: string
  isPending: boolean
  date: string
}

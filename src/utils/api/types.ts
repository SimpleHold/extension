import { TTime } from 'utils/dates'

export interface IGetBalance { // TODO: remove deprecated
  balance: number
  balance_usd: number
  balance_btc: number
  pending: number
  pending_btc: number
  isBalanceError?: boolean
}

export interface IGetBalances {
  address: string
  chain: string
  tokenSymbol?: string
  contractAddress?: string
  balanceInfo: TBalanceInfo
}

export type TBalanceInfo = {
  balance: number
  balance_usd: number
  balance_btc: number
  pending: number
  pending_btc: number
  balance_string: string
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
  hash: string
  amount: number
  estimated: number
  type: 'spend' | 'received'
  isPending: boolean
  date: string
  disabled?: boolean
}

export type TCustomFee = {
  slow: number
  average: number
  fast: number
}

export type TTxWallet = {
  chain: string
  address: string
  symbol: string
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

export type TFullTxHistoryResponse = {
  error: boolean
  data?: TFullTxWallet[]
}

export type TFullTxWallet = {
  chain: string
  address: string
  symbol: string
  txs: TTxFullInfo[]
  tokenSymbol?: string
  contractAddress?: string
}

export type TTxFullInfo = {
  type: "received" | "spend"
  hash: string
  amount: number
  estimated: number
  fee: number
  feeEstimated: number
  chain: string
  address: string
  date: string
  isPending: boolean
  symbol: string
  addressFrom?: string
  addressTo?: string
  addressesFrom?: [{
    address: string
    amount: number
    estimated: number
  }]
  addressesTo?: [{
    address: string
    amount: number
    estimated: number
  }]
  tokenSymbol?: string
  contractAddress?: string
}

export type TNft = {
  tokenId: number
  name: string
  contractAddress: string
  chain: string
  image?: string
  traits?: TTrait[]
}

export type TNFtWallets = {
  address: string
  chain: string
}

export type TTrait = {
  trait_type: string
  value: string
}

export type TVetTxParams = {
  blockRef: string
}

export type TTonAddressState = 'uninitialized' | 'active' | 'frozen'

export type TGetBalanceWalletProps = { // TODO remove deprecated
  symbol: string
  address: string
  chain?: string
  tokenSymbol?: string
  contractAddress?: string
  isFullBalance?: boolean
}

export type TGetBalancesWalletProps = {
  address: string
  chain?: string
  tokenSymbol?: string
  contractAddress?: string
  isFullBalance?: boolean
}

export type TGetBalanceOptions = {
  force?: boolean
  responseTimeLimit?: number
  requestDebounceTime?: TTime
}

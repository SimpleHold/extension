// Types
import { TUnspentOutput } from '@coins/types'

export interface ILocationState {
  amount: number
  symbol: string
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: TUnspentOutput[]
  chain: string
  networkFeeSymbol: string
  isIncludeFee: boolean
  contractAddress?: string
  tokenChain?: string
  decimals?: number
  extraId?: string
  tokenName?: string
}

export interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'feedback'
  password: string
  inputErrorLabel: null | string
  transactionLink: string
  isButtonLoading: boolean
  failText: string
  logCaptured: boolean
}

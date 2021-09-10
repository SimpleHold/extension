// Types
import { THistoryTx } from '@utils/api/types'

export interface ILocationState {
  hash: string
  symbol: string
  address: string
  chain: string
  tokenChain?: string
  tokenSymbol?: string
  contractAddress?: string
}

export interface IState {
  txInfo: null | THistoryTx
  isCopied: boolean
  isLoadingError: boolean
  activeDrawer: null | 'txAddresses'
  activeDrawerTabKey: 'senders' | 'recipients'
  feeSymbol: string
}

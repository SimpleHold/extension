// Types
import { THistoryTxGroup } from '@utils/history'
import { IWallet } from '@utils/wallet'

export interface IState {
  activeDrawer: null | 'filters'
  txGroups: null | THistoryTxGroup[]
  wallets: IWallet[]
  isNotFound: boolean
}

export type TTxData = {
  symbol: string
  address: string
  chain: string
  hash: string
  tokenChain?: string
  tokenSymbol?: string
  contractAddress?: string
}

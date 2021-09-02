// Types
import { THistoryTxGroup } from '@utils/txs'
import { IWallet } from '@utils/wallet'

export interface IState {
  activeDrawer: null | 'filters'
  txGroups: null | THistoryTxGroup[]
  wallets: IWallet[]
  isNotFound: boolean
}

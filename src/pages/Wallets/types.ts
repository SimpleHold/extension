// Types
import { IWallet } from '@utils/wallet'

export interface ILocationState {
  status?: string
}

export interface IState {
  wallets: null | IWallet[]
  totalBalance: null | number
  totalEstimated: null | number
  pendingBalance: null | number
  activeDrawer: null | 'filters'
  scrollPosition: number
}

export type TWalletAmountData = {
  symbol: string
  uuid: string
  amount: number
}

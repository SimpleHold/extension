// Types
import { IWallet } from '@utils/wallet'

export type TSelectedCurrency = {
  symbol: string
  name: string
  background: string
  chain?: string
}

export type TTabInfo = {
  favIconUrl: string
  url: string
}

export interface IState {
  wallets: null | IWallet[]
  isFiltersActive: boolean
  selectedCurrency: null | TSelectedCurrency
  tabInfo: null | TTabInfo
  isDraggable: boolean
}

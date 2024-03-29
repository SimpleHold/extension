import { IWallet } from '@utils/wallet'

export interface Props {
  onClose: () => void
  isActive: boolean
  onApply: () => void
}

export type TStatuses = 'sent' | 'received' | 'pending'

export type TStatusItem = {
  title: string
  key: TStatuses
}

export type TCurrency = {
  symbol: string
  name: string
  chain?: string
}

export type TFindWalletHistory = {
  symbol: string
  address: string
  chain?: string
}

export interface IState {
  status: null | TStatuses
  currencies: TCurrency[]
  selectedCurrencies: TCurrency[]
  wallets: IWallet[]
  selectedWallets: IWallet[]
  isWalletsVisible: boolean
}

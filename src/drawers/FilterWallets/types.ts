export interface Props {
  onClose: () => void
  onApply: () => void
  isActive: boolean
}

export interface IState {
  activeSortKey: string | null
  activeSortType: 'asc' | 'desc' | null
  totalHiddenWallets: number
  totalZeroBalancesWallets: number
  isShowHiddenAddress: boolean
  isShowZeroBalances: boolean
  isShowPrevHiddenAddress: boolean
  isShowPrevZeroBalances: boolean
  selectedCurrencies: TCurrency[]
  prevSelectedCurrencies: TCurrency[]
  currenciesList: TCurrency[]
}

export type TCurrency = {
  symbol: string
  chain?: string
  name: string
}

export type TSortButton = {
  title: string
  key: string
  width: number
  values: {
    asc: string
    desc: string
  }
}

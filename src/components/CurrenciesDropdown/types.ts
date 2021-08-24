export type TList = {
  logo?: {
    symbol: string
    width: number
    height: number
    br: number
    background?: string
    chain?: string
    name?: string
  }
  value: string
  label?: string
  withRadioButton?: boolean
}

export type TSelectedCurrency = {
  symbol?: string
  chain?: string
}

export interface Props {
  currencySymbol?: string
  list: TList[]
  onSelect?: (index: number) => void
  label?: string
  value?: string
  disabled?: boolean
  currencyBr?: number
  background?: string
  tokenChain?: string
  tokenName?: string
  toggleRadioButton?: (value: string) => void
  selectedCurrencies?: TSelectedCurrency[]
  renderRow?: React.ReactElement<any, any> | null
  padding?: string
  withActions?: boolean
  onResetDropdown?: () => void
  onClose?: () => void
}

export interface Props {
  amount: number
  symbol: TSymbols
  networkFee: number
  addressFrom: string
  addressTo: string
  networkFeeSymbol: string
  tokenChain?: string
  tokenName?: string
  onCancel: () => void
  onConfirm: () => void
  isButtonLoading?: boolean
  tabInfo?: TTabInfo
}

export type TTabInfo = {
  favIconUrl: string
  url: string
}

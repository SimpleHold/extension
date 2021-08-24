// Types
import { TTabInfo } from '@shared/types'

export interface Props {
  amount: number
  symbol: string
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

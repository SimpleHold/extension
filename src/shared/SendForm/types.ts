// Types
import { IWallet, THardware } from '@utils/wallet'
import { TTabInfo } from '@shared/types'

export interface Props {
  balance: number | null
  estimated: number | null
  symbol: string
  hardware?: THardware
  walletName: string
  selectedAddress: string
  tokenName?: string
  wallets: IWallet[]
  changeWallet: (address: string, name: string, hardware?: THardware) => void
  tokenChain?: string
  onCancel: () => void
  onConfirm: () => void
  isDisabled: boolean
  address: string
  setAddress: (value: string) => void
  addressErrorLabel: string | null
  openWalletsDrawer: () => void
  onGenerateExtraId: () => void
  checkAddress: () => void
  onSendAll: () => void
  extraIdName: string | null
  extraId: string
  setExtraId: (value: string) => void
  amount: string
  setAmount: (value: string) => void
  amountErrorLabel: string | null
  checkAmount: () => void
  isFeeLoading: boolean
  fee: number
  feeSymbol: string
  feeType: TFees
  setFeeType: (feeType: TFees) => void
  isCurrencyBalanceError: boolean
  currencyBalance: null | number
  isCustomFee: boolean
  showFeeDrawer: () => void
  isIncludeFee: boolean
  toggleIncludeFee: () => void
  tabInfo?: TTabInfo
}

export type TFees = 'slow' | 'average' | 'fast'

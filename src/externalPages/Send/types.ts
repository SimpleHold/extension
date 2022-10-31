// Types
import { IWallet } from '@utils/wallet'
import { TCurrency } from '@config/currencies/types'
import { TCustomFee, TFeeTypes } from '@utils/api/types'
import { TUnspentOutput } from '@coins/types'

export type TTabInfo = {
  favIconUrl: string
  url: string
}

export interface Props {
  readOnly?: boolean
  currency?: string
  amount?: number
  recipientAddress?: string
  chain?: string
  extraId?: string
}

export type TFeeValue = {
  utxos?: TUnspentOutput[]
  type: TFeeTypes
  value: number
}

export interface IState {
  address: string
  amount: string
  walletsList: IWallet[]
  selectedWallet: null | IWallet
  currencyInfo: null | TCurrency
  balance: null | number
  estimated: null | number
  addressErrorLabel: null | string
  tabInfo: null | TTabInfo
  props: Props
  fee: number
  feeSymbol: string
  isFeeLoading: boolean
  amountErrorLabel: null | string
  outputs: TUnspentOutput[]
  utxosList: TUnspentOutput[]
  currencyBalance: number
  extraId: string
  extraIdName: string
  isDraggable: boolean
  isIncludeFee: boolean
  feeType: TFeeTypes
  selectedFee: number
  customFee: TCustomFee
  activeDrawer: 'wallets' | 'aboutFee' | null
  feeValues: TFeeValue[]
  walletName: string
  walletsNotFound: boolean
  isStandingFee: boolean
  timer: null | ReturnType<typeof setTimeout>
}

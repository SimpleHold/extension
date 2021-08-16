// Types
import { IWallet } from '@utils/wallet'
import { ICurrency } from '@config/currencies'
import { TCustomFee } from '@utils/api/types'

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
  utxos?: UnspentOutput[]
  type: TFeeTypes
  value: number
}

export interface IState {
  address: string
  amount: string
  walletsList: IWallet[]
  selectedWallet: null | IWallet
  currencyInfo: null | ICurrency
  balance: null | number
  estimated: null | number
  addressErrorLabel: null | string
  tabInfo: null | TTabInfo
  props: Props
  fee: number
  feeSymbol: string
  isFeeLoading: boolean
  amountErrorLabel: null | string
  outputs: UnspentOutput[]
  utxosList: UnspentOutput[] | CardanoUnspentTxOutput[]
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
}

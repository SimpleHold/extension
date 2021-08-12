// Types
import { IWallet } from '@utils/wallet'
import { ICurrency } from '@config/currencies'

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
  networkFee: number
  isNetworkFeeLoading: boolean
  amountErrorLabel: null | string
  outputs: UnspentOutput[]
  networkFeeSymbol: string
  utxosList: UnspentOutput[] | CardanoUnspentTxOutput[]
  currencyBalance: number
  extraId: string
  extraIdName: string
  isDraggable: boolean
}

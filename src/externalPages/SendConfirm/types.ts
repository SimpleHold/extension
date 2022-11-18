// Types
import { TUnspentOutput } from '@coins/types'

export interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'ledger' | 'wrongDevice'
  password: string
  inputErrorLabel: null | string
  txLink: string
  isButtonLoading: boolean
  failText: string
  amount: string
  isDraggable: boolean
  backgroundProps: TBackgroundProps | null
  address: string
  memo: string
  feeEstimated: number
  ledgerDrawerState: 'wrongDevice' | 'wrongApp' | 'connectionFailed' | 'reviewTx' | null
  storeData: TStoreData | null
}

export type TBackgroundProps = {
  amount: string
  chain?: string
  currency: string
  readOnly?: boolean
  extraId?: string
  recipientAddress?: string
}

export type TStoreData = {
  fee: number
  feeSymbol: string
  balance: string
  utxos: TUnspentOutput[]
  coinPrice: number
}

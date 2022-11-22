// Types
import { TCurrency } from '@config/currencies/types'
import { TToken } from '@tokens/types'

export interface ILocationState {
  address: string
  currency: TCurrency
}

export interface IState {
  searchValue: string
  activeDrawer: null | 'confirm'
  password: string
  errorLabel: null | string
  tokenSymbol: string
  tokensList: TToken[]
}

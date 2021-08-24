// Types
import { ICurrency } from '@config/currencies'
import { IToken } from '@config/tokens'

export interface ILocationState {
  address: string
  currency: ICurrency
}

export interface IState {
  searchValue: string
  activeDrawer: null | 'confirm'
  password: string
  errorLabel: null | string
  tokenSymbol: string
  tokensList: IToken[]
}

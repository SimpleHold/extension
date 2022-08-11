// Types
import { ICurrency } from '@config/currencies'
import { IToken } from '@config/tokens'

export interface ILocationState {
  address: string
  symbol: string
  walletName: string
  currency: ICurrency | IToken
  isRedirect?: boolean
}

export interface IState {
  isCopied: boolean
  extraIdName: string
  activeDrawer: null | 'extraId'
}

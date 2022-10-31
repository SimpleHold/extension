// Types
import { TCurrency } from '@config/currencies/types'
import { TToken } from '@tokens/types'

export interface ILocationState {
  address: string
  symbol: string
  walletName: string
  currency: TCurrency | TToken
  isRedirect?: boolean
}

export interface IState {
  isCopied: boolean
  extraIdName: string
  activeDrawer: null | 'extraId'
}

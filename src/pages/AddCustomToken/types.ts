// Types
import { TCurrency } from '@config/currencies/types'
import { TNetwork } from '@config/networks'

export interface IToken {
  name: string
  symbol: string
  decimals: number
}

export interface ILocationState {
  activeNetwork?: string
  currency?: TCurrency
  address?: string
}

export interface IState {
  contractAddress: string
  selectedNetwork: TNetwork
  errorLabel: null | string
  isLoading: boolean
  tokenInfo: IToken
  activeDrawer: null | 'confirm'
  password: string
  drawerErrorLabel: null | string
  logoSymbol: string
  logoBackground: string
}

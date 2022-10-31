// Types
import { ICurrency } from 'config/currencies/currencies'
import { IEthNetwork } from '@config/ethLikeNetworks'

export interface IToken {
  name: string
  symbol: string
  decimals: number
}

export interface ILocationState {
  activeNetwork?: string
  currency?: ICurrency
  address?: string
}

export interface IState {
  contractAddress: string
  selectedNetwork: IEthNetwork
  errorLabel: null | string
  isLoading: boolean
  tokenInfo: IToken
  activeDrawer: null | 'confirm'
  password: string
  drawerErrorLabel: null | string
  logoSymbol: string
  logoBackground: string
}

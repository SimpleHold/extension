// Types
import { TTrezorCurrency } from '@utils/trezor'

export type TCurrency = {
  symbol: string
  addresses: string[]
}

export type TTrezorInfo = {
  device_id: string
  label: string
}

export type TSelectedAddress = {
  address: string
  symbol: string
  path: string
}

export interface IState {
  isError: boolean
  currencies: TCurrency[]
  isLoading: boolean
  currencyIndexes: TTrezorCurrency[]
  trezorInfo: TTrezorInfo
  selectedAddresses: TSelectedAddress[]
  activeDrawer: null | 'confirm' | 'success'
  password: string
  passwordErrorLabel: null | string
  isTrezorInit: boolean
  existWallets: TSelectedAddress[]
}

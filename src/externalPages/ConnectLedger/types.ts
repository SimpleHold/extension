// Types
import type Transport from '@ledgerhq/hw-transport-webusb'

export type TSelectedAddress = {
  address: string
  path: string
  symbol: string
}

export type TFirstAddress = {
  symbol: string
  address: string
}

export interface IState {
  ledgerTransport: null | Transport
  ledgerName: string
  activeDrawer: null | 'confirm' | 'success'
  password: string
  passwordErrorLabel: null | string
  selectedAddresses: TSelectedAddress[]
  existWallets: TSelectedAddress[]
  firstAddresses: TFirstAddress[]
}

export interface ILocationState {
  symbol: string
  chain: string
  chainName: string
  tokenName: string
  tokenStandart: string
  contractAddress?: string
  decimals?: number
}

export interface IState {
  chainAddresses: string[]
  selectedAddress: string
  activeDrawer: null | 'confirm'
  password: string
  errorLabel: null | string
}

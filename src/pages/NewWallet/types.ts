export interface ILocationState {
  symbol: string
  warning?: string
  backTitle?: string
  chain?: string
  tokenName?: string
  contractAddress?: string
  decimals?: number
}

export interface IState {
  activeDrawer: null | 'confirm' | 'success'
  password: string
  errorLabel: null | string
  isButtonLoading: boolean
}

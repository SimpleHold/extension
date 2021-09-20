export interface LocationState {
  symbol: string
  chain?: string
  tokenName?: string
  contractAddress?: string
  decimals?: number
}

export interface IState {
  privateKey: string
  activeDrawer: null | 'confirm' | 'success'
  errorLabel: null | string
  password: string
  isImportButtonLoading: boolean
}

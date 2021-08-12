export interface ILocationState {
  chain: string
  symbol: string
  privateKey: string
  tokens: string[]
  tokenStandart: string
  tokenName?: string
  contractAddress?: string
  decimals: number
}

export interface IState {
  selectedTokens: string[]
  activeDrawer: null | 'confirm'
  password: string
  errorLabel: null | string
  isIncludeTokens: boolean
}

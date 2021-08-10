export interface ILocationState {
  amount: number
  symbol: TSymbols
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: UnspentOutput[]
  chain: string
  networkFeeSymbol: string
  contractAddress?: string
  tokenChain?: string
  decimals?: number
  extraId?: string
}

export interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'feedback'
  password: string
  inputErrorLabel: null | string
  transactionLink: string
  isButtonLoading: boolean
  failText: string
}

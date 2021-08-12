export interface ILocationState {
  amount: number
  symbol: string
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: UnspentOutput[]
  chain: string
  networkFeeSymbol: string
  isIncludeFee: boolean
  contractAddress?: string
  tokenChain?: string
  decimals?: number
  extraId?: string
  name?: string
}

export interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'feedback'
  password: string
  inputErrorLabel: null | string
  transactionLink: string
  isButtonLoading: boolean
  failText: string
}

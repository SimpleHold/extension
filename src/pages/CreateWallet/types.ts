type TInitialCurrency = {
  symbol: string
  chain?: string
}

export interface IState {
  password: string
  confirmPassword: string
  isAgreed: boolean
  passwordErrorLabel: null | string
  confirmPasswordErrorLabel: null | string
  initialCurrencies: TInitialCurrency[]
}

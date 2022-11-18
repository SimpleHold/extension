export interface ILocationState {
  address: string
  memo: string
  feeEstimated: number
  amount: string
}

export interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'feedback'
  password: string
  inputErrorLabel: null | string
  txLink: string
  isButtonLoading: boolean
  failText: string
  logCaptured: boolean
  amount: string
}

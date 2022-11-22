// Types
import { IState } from './types'

export const initialState: IState = {
  activeDrawer: null,
  password: '',
  inputErrorLabel: null,
  txLink: '',
  isButtonLoading: false,
  failText: '',
  logCaptured: false,
  amount: '',
}

export const warnings = {
  xlm: 'You are sending funds to an inactive address. Due to the Network rules, you must transfer at least 1.0001 XLM to activate it.',
  xrp: 'You are sending funds to an inactive address. Due to the Network rules, you must transfer at least 20 XRP to activate it.',
}

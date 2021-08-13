export interface IState {
  isInvalidFile: boolean
  backupData: null | string
  isAgreed: boolean
  activeDrawer: null | 'confirm' | 'fail'
  password: string
  passwordErrorLabel: null | string
}

export interface IState {
  isAgreed: boolean
  isFileBroken: boolean
  backupData: string
  activeDrawer: null | 'confirm' | 'fail' | 'success'
  password: string
  passwordErrorLabel: null | string
  isPageActive: boolean
}

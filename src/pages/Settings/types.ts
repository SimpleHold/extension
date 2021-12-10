export interface IList {
  isButton?: boolean
  title: string
  text?: string
  icon?: {
    source: string
    width: number
    height: number
  }
  onClick?: () => void
  withSwitch?: boolean
  switchValue?: boolean
  hideInWindowed?: boolean
  onToggle?: () => void
}

export interface IState {
  activeDrawer: null | 'passcode' | 'logout'
  passcodeDrawerType: 'create' | 'remove'
  isPasscodeError: boolean
  isDownloadManually: boolean
  version: string
}

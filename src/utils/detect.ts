import { detect } from 'detect-browser'

export type TOS = 'windows' | 'macos' | 'unix' | 'linux' | 'unknown'

export const detectOS = (): TOS => {
  const { appVersion } = navigator

  if (appVersion.indexOf('Win') !== -1) {
    return 'windows'
  } else if (appVersion.indexOf('Mac') !== -1) {
    return 'macos'
  } else if (appVersion.indexOf('X11') !== -1) {
    return 'unix'
  } else if (appVersion.indexOf('Linux') !== -1) {
    return 'linux'
  }
  return 'unknown'
}

export const detectBrowser = () => {
  return detect()?.name
}

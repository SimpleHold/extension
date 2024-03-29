import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import Switch from '@components/Switch'

// Drawers
import PasscodeDrawer from '@drawers/Passcode'
import LogoutDrawer from '@drawers/Logout'

// Utils
import { downloadBackupFile as downloadBackup } from '@utils/backup'
import { logEvent } from '@utils/metrics'
import { sha256hash } from '@utils/crypto'
import { detectBrowser, detectOS } from '@utils/detect'
import { openAppInNewWindow, openWebPage } from '@utils/extension'
import { getManifest } from '@utils/extension'
import { getItem, setItem, removeItem, removeCache } from '@utils/storage'

// Config
import {
  SETTINGS_BACKUP,
  SETTINGS_SIGN_IN_MOBILE,
  SETTINGS_OPEN_WINDOW,
  SUPPORT_SELECT,
  SETTINGS_SELECT,
  SETTINGS_TOGGLE_PASSCODE,
} from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Icons
import cloudIcon from '@assets/icons/cloud.svg'
import linkIcon from '@assets/icons/link.svg'
import qrCodeIcon from '@assets/icons/qrCode.svg'
import helpIcon from '@assets/icons/help.svg'

// Types
import { IList, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  activeDrawer: null,
  passcodeDrawerType: 'create',
  isPasscodeError: false,
  isDownloadManually: false,
  version: '1',
}

const Settings: React.FC = () => {
  const history = useHistory()

  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    checkBrowserAndOS()
    getManifestInfo()
  }, [])

  React.useEffect(() => {
    logEvent({
      name: SETTINGS_SELECT,
    })
  }, [])

  const getManifestInfo = () => {
    const { version } = getManifest()
    updateState({ version })
  }

  const checkBrowserAndOS = () => {
    const os = detectOS()
    const browser = detectBrowser()

    if (os === 'macos' && browser === 'chrome') {
      updateState({ isDownloadManually: true })
    }
  }

  const onDownloadBackup = async () => {
    // Manual download for mac/chrome is currently removed
    const backup = getItem('backup')

    if (backup) {
      logEvent({
        name: SETTINGS_BACKUP,
      })

      await downloadBackup(backup)
    }
  }

  const togglePasscode = (): void => {
    const getPasscode = getItem('passcode')

    updateState({
      activeDrawer: 'passcode',
      passcodeDrawerType: getPasscode !== null ? 'remove' : 'create',
    })
  }

  const onScanQrCode = (): void => {
    logEvent({
      name: SETTINGS_SIGN_IN_MOBILE,
    })

    history.push('/scan-backup')
  }

  const openInWindow = () => {
    logEvent({
      name: SETTINGS_OPEN_WINDOW,
    })
    openAppInNewWindow()
  }

  const list: IList[] = [
    {
      isButton: true,
      title: 'Download the backup',
      icon: {
        source: state.isDownloadManually ? linkIcon : cloudIcon,
        width: state.isDownloadManually ? 16 : 22,
        height: state.isDownloadManually ? 16 : 14,
      },
      onClick: onDownloadBackup,
    },
    {
      isButton: true,
      title: 'Contact support',
      icon: {
        source: helpIcon,
        width: 18,
        height: 18,
      },
      onClick: () => {
        logEvent({
          name: SUPPORT_SELECT,
          properties: {
            page: 'settings',
          },
        })
        openWebPage('https://simplehold.io/about')
      },
    },
    {
      isButton: true,
      title: 'Sign-in on mobile wallet',
      icon: {
        source: qrCodeIcon,
        width: 18,
        height: 18,
      },
      onClick: onScanQrCode,
    },
    {
      isButton: true,
      hideInWindowed: true,
      title: 'Open in a new window',
      icon: {
        source: linkIcon,
        width: 16,
        height: 16,
      },
      onClick: openInWindow,
    },
    {
      title: 'Use passcode',
      text: 'Use a passcode instead of a password to easily hide wallet data from other people',
      withSwitch: true,
      switchValue: getItem('passcode') !== null,
      onToggle: togglePasscode,
    },
  ]

  const onLogout = (): void => {
    updateState({ activeDrawer: 'logout' })
  }

  const onConfirmLogout = async () => {
    await onDownloadBackup()
    removeCache()

    history.push('/welcome')
  }

  const onConfirmPasscode = (passcode: string) => {
    if (state.passcodeDrawerType === 'remove') {
      if (sha256hash(passcode) === getItem('passcode')) {
        removeItem('passcode')
        updateState({ activeDrawer: null, passcodeDrawerType: 'create' })

        logEvent({
          name: SETTINGS_TOGGLE_PASSCODE,
          properties: {
            is_enable: 'no',
          },
        })
      } else {
        updateState({ isPasscodeError: true })
      }
    } else {
      setItem('passcode', sha256hash(passcode))

      updateState({ activeDrawer: null, passcodeDrawerType: 'remove' })

      logEvent({
        name: SETTINGS_TOGGLE_PASSCODE,
        properties: {
          is_enable: 'yes',
        },
      })
    }
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setIsPasscodeError = (isPasscodeError: boolean): void => {
    updateState({ isPasscodeError })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Back" onBack={history.goBack} activePage="settings" whiteLogo />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Settings</Styles.Title>

            <Styles.List>
              {list.map((list: IList) => {
                const {
                  isButton,
                  title,
                  icon = null,
                  withSwitch,
                  switchValue,
                  onToggle,
                  text,
                  onClick,
                } = list

                if (window.name && list.hideInWindowed) {
                  return null
                }

                return (
                  <Styles.ListItem key={title} isButton={isButton} onClick={onClick}>
                    <Styles.ListItemRow>
                      <Styles.ListTitleRow>
                        <Styles.ListTitle>{title}</Styles.ListTitle>
                        {withSwitch && switchValue !== undefined && onToggle ? (
                          <Styles.IconRow>
                            <Switch value={switchValue} onToggle={onToggle} />
                          </Styles.IconRow>
                        ) : null}
                      </Styles.ListTitleRow>
                      {text ? <Styles.Text>{text}</Styles.Text> : null}
                    </Styles.ListItemRow>
                    {icon ? (
                      <Styles.IconRow>
                        <SVG
                          src={icon.source}
                          width={icon.width}
                          height={icon.height}
                          title="icon"
                        />
                      </Styles.IconRow>
                    ) : null}
                  </Styles.ListItem>
                )
              })}
            </Styles.List>

            <Styles.ExtensionInfo>
              <Styles.CopyRight>© 2022 SimpleHold</Styles.CopyRight>
              <Styles.Version>Version {state.version}</Styles.Version>
            </Styles.ExtensionInfo>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Log out & clear cache" onClick={onLogout} isDanger />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <LogoutDrawer
        isActive={state.activeDrawer === 'logout'}
        onClose={onCloseDrawer}
        onConfirm={onConfirmLogout}
      />
      <PasscodeDrawer
        isActive={state.activeDrawer === 'passcode'}
        onClose={onCloseDrawer}
        onConfirm={onConfirmPasscode}
        type={state.passcodeDrawerType}
        isError={state.isPasscodeError}
        setIsError={setIsPasscodeError}
      />
    </>
  )
}

export default Settings

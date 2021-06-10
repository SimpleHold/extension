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
import { download as downloadBackup } from '@utils/backup'
import { logEvent } from '@utils/amplitude'
import { sha256hash } from '@utils/crypto'
import { detectBrowser, detectOS } from '@utils/detect'
import { getUrl, openWebPage } from '@utils/extension'
import { getManifest } from '@utils/extension'
import { getItem, setItem, removeItem, removeMany } from '@utils/storage'

// Config
import { BACKUP_SETTINGS, PASSCODE_ENABLED, PASSCODE_DISABLED } from '@config/events'

// Icons
import cloudIcon from '@assets/icons/cloud.svg'
import linkIcon from '@assets/icons/link.svg'

// Styles
import Styles from './styles'

interface List {
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
  onToggle?: () => void
}

const Settings: React.FC = () => {
  const history = useHistory()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'passcode' | 'logout'>(null)
  const [passcodeDrawerType, setPasscodeDrawerType] = React.useState<'create' | 'remove'>('create')
  const [isPasscodeError, setIsPasscodeError] = React.useState<boolean>(false)
  const [isDownloadManually, setDownloadManually] = React.useState<boolean>(false)
  const [version, setVersion] = React.useState<string>('1')

  React.useEffect(() => {
    checkBrowserAndOS()
    getManifestInfo()
  }, [])

  const getManifestInfo = () => {
    const data = getManifest()
    setVersion(data.version)
  }

  const checkBrowserAndOS = () => {
    const os = detectOS()
    const browser = detectBrowser()

    if (os === 'macos' && browser === 'chrome') {
      setDownloadManually(true)
    }
  }

  const onDownloadBackup = async () => {
    if (isDownloadManually) {
      openWebPage(getUrl('download-backup.html'))
    } else {
      const backup = getItem('backup')

      if (backup) {
        logEvent({
          name: BACKUP_SETTINGS,
        })
        downloadBackup(backup)
      }
    }
  }

  const togglePasscode = (): void => {
    const getPasscode = getItem('passcode')
    setPasscodeDrawerType(getPasscode !== null ? 'remove' : 'create')

    setActiveDrawer('passcode')
  }

  const list: List[] = [
    {
      isButton: true,
      title: 'Download the backup',
      icon: {
        source: isDownloadManually ? linkIcon : cloudIcon,
        width: isDownloadManually ? 16 : 22,
        height: isDownloadManually ? 16 : 14,
      },
      onClick: onDownloadBackup,
    },
    {
      isButton: true,
      title: 'Contact support',
      icon: {
        source: linkIcon,
        width: 16,
        height: 16,
      },
      onClick: () => openWebPage('https://simplehold.io/about'),
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
    setActiveDrawer('logout')
  }

  const onConfirmLogout = (): void => {
    removeMany([
      'wallets',
      'backup',
      'activeSortKey',
      'activeSortType',
      'zeroBalancesFilter',
      'hiddenWalletsFilter',
      'selectedCurrenciesFilter',
    ])
    history.push('/welcome')
  }

  const onConfirmPasscode = (passcode: string) => {
    if (passcodeDrawerType === 'remove') {
      if (sha256hash(passcode) === getItem('passcode')) {
        removeItem('passcode')

        setActiveDrawer(null)
        setPasscodeDrawerType('create')

        logEvent({
          name: PASSCODE_DISABLED,
        })
      } else {
        setIsPasscodeError(true)
      }
    } else {
      setItem('passcode', sha256hash(passcode))

      setActiveDrawer(null)
      setPasscodeDrawerType('remove')

      logEvent({
        name: PASSCODE_ENABLED,
      })
    }
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Back" onBack={history.goBack} activePage="settings" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Settings</Styles.Title>

            <Styles.List>
              {list.map((list: List) => {
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

                return (
                  <Styles.ListItem key={title} isButton={isButton} onClick={onClick}>
                    <Styles.ListItemRow>
                      <Styles.ListTitleRow>
                        <Styles.ListTitle>{title}</Styles.ListTitle>
                        {withSwitch && switchValue !== undefined && onToggle ? (
                          <Switch value={switchValue} onToggle={onToggle} />
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
              <Styles.CopyRight>© 2021 SimpleHold</Styles.CopyRight>
              <Styles.Version>Version {version}</Styles.Version>
            </Styles.ExtensionInfo>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Log out & clear cache" onClick={onLogout} isDanger />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <LogoutDrawer
        isActive={activeDrawer === 'logout'}
        onClose={() => setActiveDrawer(null)}
        onConfirm={onConfirmLogout}
      />
      <PasscodeDrawer
        isActive={activeDrawer === 'passcode'}
        onClose={() => setActiveDrawer(null)}
        onConfirm={onConfirmPasscode}
        type={passcodeDrawerType}
        isError={isPasscodeError}
        setIsError={setIsPasscodeError}
      />
    </>
  )
}

export default Settings

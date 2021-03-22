import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { browser, Tabs } from 'webextension-polyfill-ts'

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

// Config
import { BACKUP_SETTINGS } from '@config/events'

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

  const onDownloadBackup = () => {
    const backup = localStorage.getItem('backup')

    if (backup) {
      logEvent({
        name: BACKUP_SETTINGS,
      })
      downloadBackup(backup)
    }
  }

  const openWebPage = (url: string): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url })
  }

  const togglePasscode = (): void => {
    const getPasscode = localStorage.getItem('passcode')
    setPasscodeDrawerType(getPasscode !== null ? 'remove' : 'create')

    setActiveDrawer('passcode')
  }

  const list: List[] = [
    {
      isButton: true,
      title: 'Download backup',
      icon: {
        source: cloudIcon,
        width: 22,
        height: 14,
      },
      onClick: onDownloadBackup,
    },
    {
      isButton: true,
      title: 'Contact to support',
      icon: {
        source: linkIcon,
        width: 16,
        height: 16,
      },
      onClick: () => openWebPage('https://simplehold.io/about'),
    },
    {
      title: 'Use passcode',
      text: 'Use passcode instead of password to easily hide extension data from other people',
      withSwitch: true,
      switchValue: localStorage.getItem('passcode') !== null,
      onToggle: togglePasscode,
    },
  ]

  const onLogout = (): void => {
    setActiveDrawer('logout')
  }

  const onConfirmLogout = (): void => {
    localStorage.removeItem('wallets')
    localStorage.removeItem('backup')
    history.push('/welcome')
  }

  const onConfirmPasscode = (passcode: string) => {
    setActiveDrawer(null)

    if (passcodeDrawerType === 'remove') {
      localStorage.removeItem('passcode')
    } else {
      localStorage.setItem('passcode', sha256hash(passcode))
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
      />
    </>
  )
}

export default Settings

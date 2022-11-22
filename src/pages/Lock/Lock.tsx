import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Drawers
import LogoutDrawer from '@drawers/Logout'

// Utils
import { decrypt } from '@utils/crypto'
import { downloadBackupFile as downloadBackup } from '@utils/backup'
import { validatePassword } from '@utils/validate'
import { logEvent } from '@utils/metrics'
import { openWebPage } from '@utils/extension'
import { getItem, removeCache, removeItem } from '@utils/storage'

// Config
import { SUPPORT_SELECT } from '@config/events'

// Assets
import lockImage from '@assets/illustrate/lock.svg'

// Styles
import Styles from './styles'

interface LocationState {
  status?: string
}

const Lock: React.FC = () => {
  const history = useHistory()
  const { state } = useLocation<LocationState>()

  const [password, setPassword] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'logout'>(null)
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    textInputRef.current?.focus()
  }, [])

  const onUnlock = (): void => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = getItem('backup')

      if (backup) {
        const decryptWallet = decrypt(backup, password)

        if (decryptWallet) {
          removeItem('isLocked')
          return history.replace('/wallets', {
            status: state?.status,
          })
        }
      }
    }

    return setErrorLabel('Password is not valid')
  }

  const onLogout = (): void => {
    setActiveDrawer('logout')
  }

  const onConfirmLogout = () => {
    setActiveDrawer(null)
    const backup = getItem('backup')

    if (backup) {
      downloadBackup(backup)

      removeCache()

      history.push('/welcome')
      removeItem('isLocked')
    }
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (validatePassword(password)) {
      onUnlock()
    }
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onContactSupport = () => {
    logEvent({
      name: SUPPORT_SELECT,
      properties: {
        page: 'lock',
      },
    })
    openWebPage('https://simplehold.io/about')
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions withBorder />
        <Styles.Container>
          <Styles.Image src={lockImage} alt="lock" />
          <Styles.Title>Welcome back!</Styles.Title>
          <Styles.Form onSubmit={onSubmitForm}>
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              errorLabel={errorLabel}
              inputRef={textInputRef}
            />
            <Styles.Actions>
              <Button label="Unlock" onClick={onUnlock} disabled={!validatePassword(password)} />
            </Styles.Actions>
          </Styles.Form>

          <Styles.Links>
            <Styles.Link onClick={onLogout}>Download a backup and log out</Styles.Link>
            <Styles.Link onClick={onContactSupport}>Contact support</Styles.Link>
          </Styles.Links>
        </Styles.Container>
      </Styles.Wrapper>
      <LogoutDrawer
        isActive={activeDrawer === 'logout'}
        onClose={onCloseDrawer}
        onConfirm={onConfirmLogout}
      />
    </>
  )
}

export default Lock

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
import { download as downloadBackup } from '@utils/backup'
import { validatePassword } from '@utils/validate'
import { logEvent } from '@utils/amplitude'
import { openWebPage } from '@utils/extension'
import { getItem, removeItem, removeMany } from '@utils/storage'

// Config
import { LOG_OUT_CACHE, PASSWORD_AFTER_LOG_OUT, SUCCESS_ENTER } from '@config/events'

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
    logEvent({
      name: PASSWORD_AFTER_LOG_OUT,
    })

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
          logEvent({
            name: SUCCESS_ENTER,
          })
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

      logEvent({
        name: LOG_OUT_CACHE,
      })

      removeMany([
        'backup',
        'wallets',
        'isLocked',
        'activeSortKey',
        'activeSortType',
        'zeroBalancesFilter',
        'hiddenWalletsFilter',
        'selectedCurrenciesFilter',
      ])

      history.push('/welcome')
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

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Image src="../../assets/illustrate/lock.svg" alt="lock" />
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
            <Styles.Link onClick={() => openWebPage('https://simplehold.io/about')}>
              Contact support
            </Styles.Link>
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

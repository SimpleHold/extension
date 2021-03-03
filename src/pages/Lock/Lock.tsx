import * as React from 'react'
import { browser, Tabs } from 'webextension-polyfill-ts'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Modals
import ConfirmLogoutModal from '@modals/ConfirmLogout'

// Utils
import { decrypt } from '@utils/crypto'
import { download as downloadBackup } from '@utils/backup'

// Illustrate
import lockIllustrate from '@assets/illustrate/lock.svg'

// Styles
import Styles from './styles'

const Lock: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [activeModal, setActiveModal] = React.useState<null | string>(null)

  const onUnlock = (): void => {
    const backup = localStorage.getItem('backup')

    if (backup) {
      const decryptWallet = decrypt(backup, password)

      if (decryptWallet) {
        localStorage.removeItem('isLocked')
        history.push('/wallets')
      }
    }
  }

  const openWebPage = (url: string): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url })
  }

  const onLogout = (): void => {
    setActiveModal('logout')
  }

  const onConfirmLogout = () => {
    setActiveModal(null)
    const backup = localStorage.getItem('backup')

    if (backup) {
      downloadBackup(backup)

      localStorage.removeItem('backup')
      localStorage.removeItem('wallets')
      localStorage.removeItem('isLocked')

      history.push('/welcome')
    }
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Image src={lockIllustrate} alt="lock" />
          <Styles.Title>Welcome back!</Styles.Title>
          <Styles.Form>
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPassword(e.target.value)
              }
            />
            <Styles.Actions>
              <Button label="Unlock" onClick={onUnlock} disabled={password.length < 8} />
            </Styles.Actions>
          </Styles.Form>

          <Styles.Links>
            <Styles.Link onClick={() => openWebPage('https://simplehold.io')}>
              Contact to support
            </Styles.Link>
            <Styles.Link onClick={onLogout}>Download backup and log out</Styles.Link>
          </Styles.Links>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmLogoutModal
        isActive={activeModal === 'logout'}
        onClose={() => setActiveModal(null)}
        onConfirm={onConfirmLogout}
      />
    </>
  )
}

export default Lock
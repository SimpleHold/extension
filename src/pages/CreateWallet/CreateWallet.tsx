import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Link from '@components/Link'
import AgreeTerms from '@components/AgreeTerms'

// Utils
import { validatePassword } from '@utils/validate'
import { logEvent, setUserProperties } from '@utils/amplitude'
import { generate } from '@utils/backup'
import { encrypt } from '@utils/crypto'
import { generate as generateAddress } from '@utils/address'

// Config
import { START_PASSWORD } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')
  const [isAgreed, setIsAgreed] = React.useState<boolean>(true)
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [confirmPasswordErrorLabel, setConfirmPasswordErrorLabel] = React.useState<null | string>(
    null
  )

  const passwordInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    passwordInputRef.current?.focus()
  }, [])

  const isButtonDisabled = password.length < 7 || password !== confirmPassword || !isAgreed

  const onConfirm = (): void => {
    logEvent({
      name: START_PASSWORD,
    })

    const geneateAddress = generateAddress('btc')

    if (geneateAddress) {
      const { address, privateKey } = geneateAddress
      const { backup, wallets } = generate(address, privateKey)

      localStorage.setItem('backup', encrypt(backup, password))
      localStorage.setItem('wallets', wallets)
      localStorage.setItem('backupStatus', 'notDownloaded')

      setUserProperties({
        NUMBER_WALLET_BTC: '1',
      })

      history.push('/download-backup')
    }
  }

  const onBlurPassword = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (!validatePassword(password)) {
      setPasswordErrorLabel('Password should have at least 8 symbols')
    }
  }

  const onBlurConfirmPassword = (): void => {
    if (confirmPasswordErrorLabel) {
      setConfirmPasswordErrorLabel(null)
    }

    if (confirmPassword.length && confirmPassword !== password) {
      setConfirmPasswordErrorLabel("Passwords doesn't match")
    }
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Create password</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
          </Styles.Description>
          <Link
            title="How it works?"
            to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
            mt={44}
          />
        </Styles.Row>
        <Styles.Form>
          <TextInput
            label="Enter password"
            value={password}
            onChange={setPassword}
            type="password"
            withPasswordVisible
            errorLabel={passwordErrorLabel}
            onBlurInput={onBlurPassword}
            inputRef={passwordInputRef}
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            withPasswordVisible
            errorLabel={confirmPasswordErrorLabel}
            onBlurInput={onBlurConfirmPassword}
          />
          <AgreeTerms isAgreed={isAgreed} setIsAgreed={() => setIsAgreed(!isAgreed)} mt={4} />
          <Styles.Actions>
            <Button label="Back" onClick={history.goBack} isLight mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} disabled={isButtonDisabled} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets

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
import { logEvent } from '@utils/amplitude'

// Config
import { START_PASSWORD } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')
  const [isAgreed, setIsAgreed] = React.useState<boolean>(false)
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [confirmPasswordErrorLabel, setConfirmPasswordErrorLabel] = React.useState<null | string>(
    null
  )

  const isButtonDisabled = password.length < 7 || password !== confirmPassword || !isAgreed

  const onConfirm = (): void => {
    logEvent({
      name: START_PASSWORD,
    })

    history.push('/download-backup', {
      password,
    })
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
          <Styles.Title>Сreate password</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
          </Styles.Description>
          <Link title="How it works?" to="https://simplehold.io" mt={44} />
        </Styles.Row>
        <Styles.Form>
          <TextInput
            label="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            type="password"
            withPasswordVisible
            errorLabel={passwordErrorLabel}
            onBlurInput={onBlurPassword}
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setConfirmPassword(e.target.value)
            }
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

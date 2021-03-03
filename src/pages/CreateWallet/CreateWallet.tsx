import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Link from '@components/Link'
import CheckBox from '@components/CheckBox'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')
  const [isAgreed, setIsagreed] = React.useState<boolean>(false)

  const onConfirm = (): void => {
    history.push('/download-backup', {
      password,
    })
  }

  const isButtonDisabled = password.length < 7 || password !== confirmPassword || !isAgreed

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
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setConfirmPassword(e.target.value)
            }
            type="password"
            withPasswordVisible
          />
          <Styles.AgreedBlock>
            <CheckBox value={isAgreed} onClick={() => setIsagreed(!isAgreed)} />
            <Styles.AgreedText>
              I have read and agree to the <Styles.TermsLink>Terms of Use</Styles.TermsLink>
            </Styles.AgreedText>
          </Styles.AgreedBlock>
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

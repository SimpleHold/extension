import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Icons
import askIcon from '@assets/icons/ask.svg'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')

  const onConfirm = (): void => {
    history.push('/backup/download')
  }

  return (
    <Styles.Wrapper>
      <Header noActions withName logoColor="#3FBB7D" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Сreate password</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
          </Styles.Description>
          <Styles.LinkRow>
            <Styles.LinkIcon>
              <SVG src={askIcon} width={12} height={12} title="ask" />
            </Styles.LinkIcon>
            <Styles.Link>How it works?</Styles.Link>
          </Styles.LinkRow>
        </Styles.Row>
        <Styles.Form>
          <TextInput
            label="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            type="password"
            minLength={8}
            maxLength={16}
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setConfirmPassword(e.target.value)
            }
            type="password"
          />
          <Button label="Confirm" onClick={onConfirm} />
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets

import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { sha256hash } from '@utils/crypto'
import { logEvent } from '@utils/amplitude'

// Config
import { PASSCODE_ENABLED } from '@config/events'

// Styles
import Styles from './styles'

const SetPasscode: React.FC = () => {
  const history = useHistory()

  const [passcode, setPasscode] = React.useState<string>('')

  const onConfirm = (): void => {
    logEvent({
      name: PASSCODE_ENABLED,
    })

    localStorage.setItem('passcode', sha256hash(passcode))
    history.goBack()
  }

  const onChangePasscode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length <= 6) {
      setPasscode(e.target.value)
    }
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Settings" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Set passcode</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
          </Styles.Description>
        </Styles.Row>

        <Styles.Form>
          <TextInput
            label="Enter passcode"
            value={passcode}
            onChange={onChangePasscode}
            type="number"
          />
          <Styles.Actions>
            <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
            <Button label="Confirm" disabled={passcode.length !== 6} ml={7.5} onClick={onConfirm} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SetPasscode

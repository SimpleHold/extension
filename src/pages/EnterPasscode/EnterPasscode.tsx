import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import OneTimePassword from '@components/OneTimePassword'

// Drawers
import ForgotPasscodeDrawer from '../../drawers/ForgotPasscode'

// Utils
import { sha256hash } from '@utils/crypto'

// Styles
import Styles from './styles'

const EnterPasscode: React.FC = () => {
  const history = useHistory()

  const [passcode, setPasscode] = React.useState<string>('')
  const [isError, setIsError] = React.useState<boolean>(false)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'forgotPasscode'>(null)

  React.useEffect(() => {
    if (passcode.length === 6) {
      checkPasscode()
    }
  }, [passcode])

  const checkPasscode = (): void => {
    const getPasscodeHash = localStorage.getItem('passcode')

    if (getPasscodeHash && getPasscodeHash === sha256hash(passcode)) {
      localStorage.removeItem('isLocked')
      history.push('/wallets')
    } else {
      setIsError(true)
    }
  }

  const onConfirmReset = (): void => {}

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Image />
            <Styles.Title>Enter your passcode</Styles.Title>

            <Styles.Form>
              <OneTimePassword value={passcode} onChange={setPasscode} isError={isError} />
            </Styles.Form>
          </Styles.Row>
          <Styles.Bottom>
            <Styles.Link onClick={() => setActiveDrawer('forgotPasscode')}>
              Forgot my passcode
            </Styles.Link>
          </Styles.Bottom>
        </Styles.Container>
      </Styles.Wrapper>
      <ForgotPasscodeDrawer
        isActive={activeDrawer === 'forgotPasscode'}
        onClose={() => setActiveDrawer(null)}
        onConfirm={onConfirmReset}
      />
    </>
  )
}

export default EnterPasscode

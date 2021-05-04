import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import OneTimePassword from '@components/OneTimePassword'

// Drawers
import ForgotPasscodeDrawer from '@drawers/ForgotPasscode'

// Utils
import { sha256hash } from '@utils/crypto'
import { logEvent } from '@utils/amplitude'

// Config
import { PASSCODE_LOCKED_INVALID, PASSCODE_LOCKED_FORGOT } from '@config/events'

// Styles
import Styles from './styles'

const EnterPasscode: React.FC = () => {
  const history = useHistory()

  const [passcode, setPasscode] = React.useState<string>('')
  const [isError, setIsError] = React.useState<boolean>(false)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'forgotPasscode'>(null)

  const handleInputFocus = (index: number) => {
    if (index !== 0) {
      setIsError(false)
    }
  }

  React.useEffect(() => {
    for (let i = 0; i < document.querySelectorAll('input').length; i++) {
      document.querySelectorAll('input')[i].addEventListener('focus', () => handleInputFocus(i))
    }

    return () => {
      for (let i = 0; i < document.querySelectorAll('input').length; i++) {
        document
          .querySelectorAll('input')
          [i].removeEventListener('focus', () => handleInputFocus(i))
      }
    }
  }, [])

  React.useEffect(() => {
    if (passcode.length === 6) {
      checkPasscode()
    }
  }, [passcode])

  const checkPasscode = (): void => {
    const getPasscodeHash = localStorage.getItem('passcode')

    if (getPasscodeHash && getPasscodeHash === sha256hash(passcode)) {
      localStorage.removeItem('isLocked')
      history.replace('/wallets')
    } else {
      setIsError(true)
      setPasscode('')

      logEvent({
        name: PASSCODE_LOCKED_INVALID,
      })
    }
  }

  const onConfirmReset = (): void => {
    history.push('/lock', {
      status: 'passcodeTurnedOff',
    })

    logEvent({
      name: PASSCODE_LOCKED_FORGOT,
    })
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Image />
            <Styles.Title>Welcome back!</Styles.Title>

            <Styles.Form onSubmit={onSubmitForm}>
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

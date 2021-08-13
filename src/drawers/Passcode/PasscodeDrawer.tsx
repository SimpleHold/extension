import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import OneTimePassword from '@components/OneTimePassword'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  onConfirm: (passcode: string) => void
  type: 'create' | 'remove'
  isError: boolean
  setIsError: (isError: boolean) => void
}

const PasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onConfirm, type, isError, setIsError } = props

  const [passcode, setPasscode] = React.useState<string>('')

  React.useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        document.querySelectorAll('input')[0]?.focus()
      }, 100)

      if (type === 'remove') {
        addFormEventsListener()
      }
    }

    if (passcode.length) {
      setPasscode('')
    }
  }, [isActive])

  React.useEffect(() => {
    if (isError) {
      setPasscode('')
    }
  }, [isError])

  const addFormEventsListener = (): void => {
    for (let i = 0; i < document.querySelectorAll('input').length; i++) {
      document.querySelectorAll('input')[i].addEventListener('focus', () => {
        setIsError(false)
      })
    }
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <DrawerWrapper
      title={type === 'create' ? 'Create your passcode' : 'Enter your passcode'}
      isActive={isActive}
      onClose={onClose}
    >
      <Styles.Row>
        <Styles.Form onSubmit={onSubmitForm}>
          <OneTimePassword value={passcode} onChange={setPasscode} isError={isError} />
        </Styles.Form>

        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
          <Button label="Ok" disabled={passcode.length !== 6} onClick={() => onConfirm(passcode)} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default PasscodeDrawer

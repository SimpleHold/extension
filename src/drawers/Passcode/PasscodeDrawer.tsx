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
}

const PasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onConfirm, type } = props

  const [passcode, setPasscode] = React.useState<string>('')

  React.useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('[aria-label="Digit 1"]')?.focus()
      }, 300)

      if (passcode.length) {
        setPasscode('')
      }
    }
  }, [isActive])

  return (
    <DrawerWrapper
      title={type === 'create' ? 'Create your passcode' : 'Enter your passcode'}
      isActive={isActive}
      onClose={onClose}
    >
      <Styles.Row>
        <Styles.Form>
          <OneTimePassword value={passcode} onChange={setPasscode} />
        </Styles.Form>

        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} isSmall />
          <Button
            label="Ok"
            disabled={passcode.length !== 6}
            onClick={() => onConfirm(passcode)}
            isSmall
          />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default PasscodeDrawer

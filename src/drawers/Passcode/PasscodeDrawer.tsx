import * as React from 'react'
import OtpInput from 'react-otp-input'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
}

const PasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [passcode, setPasscode] = React.useState<string>('')

  const onConfirm = (): void => {}

  return (
    <DrawerWrapper title="Enter your passcode" isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Form>
          <OtpInput value={passcode} onChange={setPasscode} numInputs={6} isInputNum />
        </Styles.Form>

        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} isSmall />
          <Button label="Ok" disabled={passcode.length !== 6} onClick={onConfirm} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default PasscodeDrawer

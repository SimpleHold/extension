import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ForgotPasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onConfirm } = props

  return (
    <DrawerWrapper title="Forgot my passcode" isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Text>
          You can unlock your wallet with the password. The passcode will be disabled, and you can
          turn it on again in settings after unlocking.
        </Styles.Text>

        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
          <Button label="Ok" onClick={onConfirm} ml={7.5} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ForgotPasscodeDrawer

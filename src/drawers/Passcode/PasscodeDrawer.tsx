import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import OneTimePassword from '@components/OneTimePassword'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
  onConfirm: (passcode: string) => void
  type: 'create' | 'remove'
}

const PasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onConfirm, type } = props

  const [passcode, setPasscode] = React.useState<string>('')

  if (isActive) {
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
            <Button label="Ok" disabled={passcode.length !== 6} onClick={onConfirm} isSmall />
          </Styles.Actions>
        </Styles.Row>
      </DrawerWrapper>
    )
  }
  return null
}

export default PasscodeDrawer

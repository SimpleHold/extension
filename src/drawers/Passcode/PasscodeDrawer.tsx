import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import OneTimePassword from '@components/OneTimePassword'
import Button from '@components/Button'

// Utils
import { sha256hash } from '@utils/crypto'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
}

const PasscodeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [passcode, setPasscode] = React.useState<string>('')

  const onConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    localStorage.setItem('passcode', sha256hash(passcode))
    onClose(e)
  }

  return (
    <DrawerWrapper title="Enter your passcode" isActive={isActive} onClose={onClose}>
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

export default PasscodeDrawer

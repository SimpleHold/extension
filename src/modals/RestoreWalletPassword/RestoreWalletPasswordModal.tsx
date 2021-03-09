import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { decrypt } from '@utils/crypto'
import { validateWallet, validatePassword } from '@utils/validate'
import { logEvent } from '@utils/amplitude'

// Config
import { START_RESTORE_PASSWORD } from '@config/events'

// Styles
import Styles from './styles'

interface Props {
  backupData: null | string
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onSuccess: Function
}

const RestoreWalletPasswordModal: React.FC<Props> = (props) => {
  const { backupData, isActive, onClose, onSuccess } = props

  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const onConfirm = (): void => {
    logEvent({
      name: START_RESTORE_PASSWORD,
    })

    if (errorLabel) {
      setErrorLabel(null)
    }

    if (!validatePassword(password)) {
      return setErrorLabel('Password is not valid')
    }

    if (backupData) {
      const decryptBackup = decrypt(backupData, password)

      if (decryptBackup === null) {
        setErrorLabel('Password is not valid')
      } else {
        const validateFile = validateWallet(decryptBackup)

        if (validateFile) {
          localStorage.setItem('backup', backupData)
          localStorage.setItem('wallets', decryptBackup)
          onSuccess()
        } else {
          alert('error file') // Fix me add modal
        }
      }
    }
  }

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon="../../assets/modalIcons/confirm.svg">
      <Styles.Row>
        <Styles.Title>Confirm adding new address</Styles.Title>
        <Styles.Form>
          <TextInput
            label="Enter password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            errorLabel={errorLabel}
          />
          <Styles.Actions>
            <Button label="Cancel" onClick={onClose} isLight mr={7.5} isSmall />
            <Button
              label="Ok"
              onClick={onConfirm}
              ml={7.5}
              isSmall
              disabled={!validatePassword(password)}
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default RestoreWalletPasswordModal

import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { validatePassword } from '@utils/validate'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  address: string
  onSuccess: (privateKey: string) => void
}

const ConfirmShowingPrivateKeyModal: React.FC<Props> = (props) => {
  const { isActive, onClose, address, onSuccess } = props

  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const onConfirm = (): void => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => (wallet.address = address)
          )

          if (findWallet) {
            return onSuccess(findWallet.privateKey)
          }
        }
      }
    }

    return setErrorLabel('Password is not valid')
  }

  const onBlurInput = (): void => {
    if (!password.length && errorLabel !== null) {
      setErrorLabel(null)
    }
  }

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon="../../assets/modalIcons/key.svg">
      <Styles.Row>
        <Styles.Title>Confirm showing private key</Styles.Title>

        <Styles.Form>
          <TextInput
            label="Enter password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            errorLabel={errorLabel}
            onBlurInput={onBlurInput}
          />
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button
              label="Ok"
              disabled={!validatePassword(password)}
              onClick={onConfirm}
              ml={7.5}
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmShowingPrivateKeyModal

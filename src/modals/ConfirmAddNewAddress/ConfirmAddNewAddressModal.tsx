import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { validatePassword } from '@utils/validate'
import { decrypt, addNewWallet, encrypt } from '@utils/crypto'
import { importAddress } from '@utils/bitcoin'

// Icons
import modalIcon from '@assets/modalIcons/confirm.svg'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  privateKey: string | null
  onSuccess: () => void
}

const ConfirmAddNewAddressModal: React.FC<Props> = (props) => {
  const { isActive, onClose, privateKey, onSuccess } = props

  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup && privateKey) {
        const encryptBackup = decrypt(backup, password)

        if (encryptBackup) {
          const address = importAddress(privateKey)

          if (address) {
            const newWalletsList = addNewWallet(privateKey, address, 'btc')

            if (newWalletsList) {
              localStorage.setItem('backup', encrypt(newWalletsList, password))
              localStorage.setItem('wallets', newWalletsList)

              return onSuccess()
            }
          }
        }
      }
    }
    return setErrorLabel('Invalid password')
  }

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon={modalIcon}>
      <Styles.Row>
        <Styles.Title>Confirm adding new address</Styles.Title>

        <Styles.Form>
          <TextInput
            label="Enter password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            withError={errorLabel !== null}
            errorLabel={errorLabel}
          />
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Ok" disabled={password.length < 8} onClick={onConfirm} mr={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmAddNewAddressModal

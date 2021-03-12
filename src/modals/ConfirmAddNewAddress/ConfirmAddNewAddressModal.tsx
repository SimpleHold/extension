import * as React from 'react'
import { v4 } from 'uuid'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { validatePassword, validateBitcoinPrivateKey } from '@utils/validate'
import { decrypt, encrypt } from '@utils/crypto'
import { addNew as addNewWallet } from '@utils/wallet'

// Hooks
import usePrevious from '@hooks/usePrevious'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  privateKey: string | null
  onSuccess: (password: string) => void
}

const ConfirmAddNewAddressModal: React.FC<Props> = (props) => {
  const { isActive, onClose, privateKey, onSuccess } = props

  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const prevModalState = usePrevious(isActive)

  React.useEffect(() => {
    if (isActive && !prevModalState) {
      clearState()
    }
  }, [isActive, prevModalState])

  const clearState = (): void => {
    if (password?.length) {
      setPassword('')
    }
    if (errorLabel) {
      setErrorLabel(null)
    }
  }

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup && privateKey) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup && validateBitcoinPrivateKey(privateKey)) {
          const parseBackup = JSON.parse(decryptBackup)

          const address = window.importAddress(privateKey)

          if (address) {
            const uuid = v4()
            const newWalletsList = addNewWallet(address, 'btc', uuid)

            parseBackup.wallets.push({
              symbol: 'btc',
              address,
              uuid,
              privateKey,
            })

            if (newWalletsList) {
              localStorage.setItem('backup', encrypt(JSON.stringify(parseBackup), password))
              localStorage.setItem('wallets', newWalletsList)
              return onSuccess(password)
            }
          }
        }
      }
    }
    return setErrorLabel('Password is not valid')
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
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button
              label="Ok"
              disabled={!validatePassword(password)}
              onClick={onConfirm}
              mr={7.5}
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmAddNewAddressModal

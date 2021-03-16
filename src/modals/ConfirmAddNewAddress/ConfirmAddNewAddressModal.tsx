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

// Utils
import { importAddress } from '@utils/bitcoin'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  privateKey: string | null
  onSuccess: (password: string) => void
  symbol: string
  provider: any
}

const ConfirmAddNewAddressModal: React.FC<Props> = (props) => {
  const { isActive, onClose, privateKey, onSuccess, symbol, provider } = props

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

        // && validateBitcoinPrivateKey(privateKey)
        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)

          const address = importAddress(provider, privateKey)

          console.log('address', address)
          console.log('symbol', symbol)

          if (address) {
            const uuid = v4()
            const newWalletsList = addNewWallet(address, symbol, uuid)

            parseBackup.wallets.push({
              symbol,
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

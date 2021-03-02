import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { decrypt } from '@utils/crypto'
import { IWallet } from 'utils/wallet'

// Icons
import modalIcon from '@assets/modalIcons/key.svg'

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
  const [isError, setIsError] = React.useState<boolean>(false)

  const onConfirm = (): void => {
    if (isError) {
      setIsError(false)
    }

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

    return setIsError(true)
  }

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon={modalIcon}>
      <Styles.Row>
        <Styles.Title>Confirm showing private key</Styles.Title>

        <Styles.Form>
          <TextInput
            label="Enter password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
            withError={isError}
            errorLabel="Invalid password"
            minLength={8}
          />
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Ok" disabled={password.length < 8} onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmShowingPrivateKeyModal

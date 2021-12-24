import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'
import AgreeTerms from '@components/AgreeTerms'

// Shared
import RestoreWalletShared from '@shared/RestoreWallet'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import FailDrawer from '@drawers/Fail'

// Utils
import { logEvent } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { validate as validateBackup } from '@utils/backup'
import { setItem } from '@utils/storage'

// Config
import { START_RESTORE_CONFIRM, START_RESTORE_PASSWORD } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  isInvalidFile: false,
  backupData: '',
  isAgreed: true,
  activeDrawer: null,
  password: '',
  passwordErrorLabel: null,
}

const RestoreWallet: React.FC = () => {
  const history = useHistory()

  const { state, updateState } = useState<IState>(initialState)

  const onDrop = React.useCallback(async (acceptedFiles) => {
    updateState({ isInvalidFile: false, backupData: '' })

    const text = await acceptedFiles[0]?.text()

    if (text?.length > 0 && acceptedFiles[0].name.indexOf('.dat') !== -1) {
      updateState({ backupData: text })
    } else {
      updateState({ isInvalidFile: true })
    }
  }, [])

  const onConfirm = (): void => {
    logEvent({
      name: START_RESTORE_CONFIRM,
    })

    updateState({ activeDrawer: 'confirm' })
  }

  const onConfirmRestore = (): void => {
    logEvent({
      name: START_RESTORE_PASSWORD,
    })

    if (state.passwordErrorLabel) {
      updateState({ passwordErrorLabel: null })
    }

    if (!validatePassword(state.password)) {
      return updateState({ passwordErrorLabel: 'Password is not valid' })
    }

    if (state.backupData) {
      const decryptBackup = decrypt(state.backupData, state.password)

      if (decryptBackup === null) {
        updateState({ passwordErrorLabel: 'Password is not valid' })
      } else {
        const getWalletsList = validateBackup(decryptBackup)

        if (getWalletsList) {
          setItem('backup', state.backupData)
          setItem('wallets', getWalletsList)
          history.replace('/wallets')
        } else {
          updateState({ activeDrawer: 'fail' })
        }
      }
    }
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const toggleAgreed = (): void => {
    updateState({ isAgreed: !state.isAgreed })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Restore</Styles.Title>
            <Styles.Text>You can restore your SimpleHold wallet with a backup file.</Styles.Text>

            <RestoreWalletShared
              isFileBroken={state.isInvalidFile}
              isFileUploaded={state.backupData.length > 0}
              onDrop={onDrop}
            />

            <AgreeTerms isAgreed={state.isAgreed} setIsAgreed={toggleAgreed} mt={20} />
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" onClick={history.goBack} isLight mr={7.5} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              ml={7.5}
              disabled={!state.backupData?.length || !state.isAgreed}
            />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Enter your password to restore the wallet."
        textInputValue={state.password}
        onChangeText={setPassword}
        onConfirm={onConfirmRestore}
        textInputType="password"
        inputLabel="Enter password"
        isButtonDisabled={!validatePassword(state.password)}
        inputErrorLabel={state.passwordErrorLabel}
      />
      <FailDrawer
        isActive={state.activeDrawer === 'fail'}
        onClose={onCloseDrawer}
        text="The backup file is broken. We cannot restore your wallet. Check your backup file and try again."
      />
    </>
  )
}

export default RestoreWallet

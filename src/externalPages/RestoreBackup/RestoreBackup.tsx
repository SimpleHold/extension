import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import AgreeTerms from '@components/AgreeTerms'
import Button from '@components/Button'

// Shared
import RestoreWallet from '@shared/RestoreWallet'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import FailDrawer from '@drawers/Fail'
import SuccessDrawer from '@drawers/Success'

// Utils
import { logEvent } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { validate as validateBackup } from '@utils/backup'
import { setBadgeBackgroundColor, setBadgeText } from '@utils/extension'
import { getItem, setItem, removeItem } from '@utils/storage'

// Config
import { START_RESTORE_CONFIRM, START_RESTORE_PASSWORD } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState } from './types'

// Icons
import puzzleIcon from '../../assets/modalIcons/puzzle.svg'

// Styles
import Styles from './styles'

const initialState: IState = {
  isAgreed: true,
  isFileBroken: false,
  backupData: '',
  activeDrawer: null,
  password: '',
  passwordErrorLabel: null,
  isPageActive: false
}

const RestoreBackup: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    if (getItem('manualRestoreBackup') === 'active') {
      updateState({ isPageActive: true })
    }
  }, [])

  const onDrop = React.useCallback(async (acceptedFiles) => {
    updateState({ isFileBroken: false, backupData: '' })

    const text = await acceptedFiles[0]?.text()

    if (text?.length > 0 && acceptedFiles[0].name.indexOf('.dat') !== -1) {
      updateState({ backupData: text })
    } else {
      updateState({ isFileBroken: true })
    }
  }, [])

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = (): void => {
    logEvent({
      name: START_RESTORE_CONFIRM
    })

    updateState({ activeDrawer: 'confirm' })
  }

  const onConfirmRestore = (): void => {
    logEvent({
      name: START_RESTORE_PASSWORD
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
          removeItem('manualRestoreBackup')

          setBadgeBackgroundColor('#EB5757')
          setBadgeText('1')

          updateState({ activeDrawer: 'success' })
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

  if (!state.isPageActive) {
    return null
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle='white'>
      <>
        <Styles.Body>
          <Styles.Title>Restore</Styles.Title>

          <RestoreWallet
            isFileBroken={state.isFileBroken}
            isFileUploaded={state.backupData.length > 0}
            onDrop={onDrop}
          />

          <AgreeTerms isAgreed={state.isAgreed} setIsAgreed={toggleAgreed} mt={20} />

          <Styles.Actions>
            <Button label='Cancel' onClick={onClose} isLight mr={7.5} />
            <Button
              label='Confirm'
              onClick={onConfirm}
              disabled={!state.backupData.length || !state.isAgreed}
              ml={7.5}
            />
          </Styles.Actions>

          <Styles.DividerLine />

          <Styles.QuestionBlock>
            <SVG src='../../assets/icons/ask.svg' width={15} height={15} title='ask' />
            <Styles.Question>Why I see this page?</Styles.Question>
          </Styles.QuestionBlock>

          <Styles.Answer>
            There are some troubles in Chrome for Mac OS X and Firefox with uploading and
            downloading files from the extension window. To avoid problems, we need to move this
            functionality to a separate tab. Thank you for using SimpleHold.
          </Styles.Answer>
        </Styles.Body>
        <ConfirmDrawer
          isActive={state.activeDrawer === 'confirm'}
          onClose={onCloseDrawer}
          title='Enter the password to restore your wallet'
          textInputValue={state.password}
          onChangeText={setPassword}
          onConfirm={onConfirmRestore}
          textInputType='password'
          inputLabel='Enter password'
          isButtonDisabled={!validatePassword(state.password)}
          inputErrorLabel={state.passwordErrorLabel}
          openFrom='browser'
        />
        <FailDrawer
          isActive={state.activeDrawer === 'fail'}
          onClose={onCloseDrawer}
          text='The backup file is broken. We cannot restore your wallet. Check your backup file and try again.'
          openFrom='browser'
        />
        <SuccessDrawer
          isActive={state.activeDrawer === 'success'}
          onClose={() => null}
          icon={puzzleIcon}
          text='We successfully restored your wallet. Go to the extension by clicking on the SimpleHold icon in the extensions menu and enjoy your crypto!'
          openFrom='browser'
          disableClose
        />
      </>
    </ExternalPageContainer>
  )
}

render(<RestoreBackup />, document.getElementById('restore-backup'))

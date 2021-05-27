import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { useDropzone } from 'react-dropzone'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import AgreeTerms from '@components/AgreeTerms'
import Button from '@components/Button'

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

// Config
import { START_RESTORE_CONFIRM, START_RESTORE_PASSWORD } from '@config/events'

// Icons
import puzzleIcon from '../../assets/modalIcons/puzzle.svg'

// Styles
import Styles from './styles'

const RestoreBackup: React.FC = () => {
  const [isAgreed, setIsAgreed] = React.useState<boolean>(true)
  const [isFileBroken, setFileBroken] = React.useState<boolean>(false)
  const [backupData, setBackupData] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'fail' | 'success'>(
    null
  )
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [isPageActive, setPageActive] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (localStorage.getItem('manualRestoreBackup') === 'active') {
      setPageActive(true)
    }
  }, [])

  const onDrop = React.useCallback(async (acceptedFiles) => {
    setFileBroken(false)
    setBackupData('')

    const text = await acceptedFiles[0]?.text()

    if (text?.length > 0 && acceptedFiles[0].name.indexOf('.dat') !== -1) {
      setBackupData(text)
    } else {
      setFileBroken(true)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = (): void => {
    logEvent({
      name: START_RESTORE_CONFIRM,
    })

    setActiveDrawer('confirm')
  }

  const onConfirmRestore = (): void => {
    logEvent({
      name: START_RESTORE_PASSWORD,
    })

    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (!validatePassword(password)) {
      return setPasswordErrorLabel('Password is not valid')
    }

    if (backupData) {
      const decryptBackup = decrypt(backupData, password)

      if (decryptBackup === null) {
        setPasswordErrorLabel('Password is not valid')
      } else {
        const getWalletsList = validateBackup(decryptBackup)

        if (getWalletsList) {
          localStorage.setItem('backup', backupData)
          localStorage.setItem('wallets', getWalletsList)
          localStorage.removeItem('manualRestoreBackup')

          setBadgeBackgroundColor('#EB5757')
          setBadgeText('1')

          setActiveDrawer('success')
        } else {
          setActiveDrawer('fail')
        }
      }
    }
  }

  if (!isPageActive) {
    return null
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="white">
      <>
        <Styles.Body>
          <Styles.Title>Restore</Styles.Title>

          <Styles.DNDArea {...getRootProps()} isFileBroken={isFileBroken}>
            <input {...getInputProps({ multiple: false })} />
            <Styles.FileIconRow>
              {isFileBroken || backupData.length ? (
                <SVG
                  src={
                    isFileBroken
                      ? '../../assets/icons/invalidFile.svg'
                      : '../../assets/icons/fileUploaded.svg'
                  }
                  width={26.5}
                  height={34.8}
                />
              ) : (
                <SVG src="../../assets/icons/file.svg" width={26.5} height={34.8} />
              )}
            </Styles.FileIconRow>

            {isFileBroken || backupData.length > 0 ? (
              <Styles.DNDText isFileBroken={isFileBroken} isFileUploaded={backupData.length > 0}>
                {isFileBroken
                  ? 'The chosen file is invalid or broken, please pick another one.'
                  : 'The backup file is successfully loaded'}
              </Styles.DNDText>
            ) : (
              <Styles.DNDText>
                Drag and drop or choose a backup file to restore your wallet
              </Styles.DNDText>
            )}
          </Styles.DNDArea>

          <AgreeTerms isAgreed={isAgreed} setIsAgreed={() => setIsAgreed(!isAgreed)} mt={20} />

          <Styles.Actions>
            <Button label="Cancel" onClick={onClose} isSmall isLight mr={7.5} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              isSmall
              disabled={!backupData.length || !isAgreed}
              ml={7.5}
            />
          </Styles.Actions>

          <Styles.DividerLine />

          <Styles.QuestionBlock>
            <SVG src="../../assets/icons/ask.svg" width={15} height={15} title="ask" />
            <Styles.Question>Why I see this page?</Styles.Question>
          </Styles.QuestionBlock>

          <Styles.Answer>
            There are some troubles in Chrome for Mac OS X and Firefox with uploading and
            downloading files from the extension window. To avoid problems, we need to move this
            functionality to a separate tab. Thank you for using SimpleHold.
          </Styles.Answer>
        </Styles.Body>
        <ConfirmDrawer
          isActive={activeDrawer === 'confirm'}
          onClose={() => setActiveDrawer(null)}
          title="Enter the password to restore your wallet"
          textInputValue={password}
          onChangeText={setPassword}
          onConfirm={onConfirmRestore}
          textInputType="password"
          inputLabel="Enter password"
          isButtonDisabled={!validatePassword(password)}
          inputErrorLabel={passwordErrorLabel}
          openFrom="browser"
        />
        <FailDrawer
          isActive={activeDrawer === 'fail'}
          onClose={() => setActiveDrawer(null)}
          text="The backup file is broken. We cannot restore your wallet. Check your backup file and try again."
          openFrom="browser"
        />
        <SuccessDrawer
          isActive={activeDrawer === 'success'}
          onClose={() => null}
          icon={puzzleIcon}
          text="We successfully restored your wallet. Go to the extension by clicking on the SimpleHold icon in the extensions menu and enjoy your crypto!"
          openFrom="browser"
          disableClose
        />
      </>
    </ExternalPageContainer>
  )
}

render(<RestoreBackup />, document.getElementById('restore-backup'))

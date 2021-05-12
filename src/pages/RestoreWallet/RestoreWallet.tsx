import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'
import AgreeTerms from '@components/AgreeTerms'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import FailDrawer from '@drawers/Fail'

// Utils
import { logEvent } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { validate as validateBackup } from '@utils/backup'

// Config
import { START_RESTORE_CONFIRM, START_RESTORE_PASSWORD } from '@config/events'

// Styles
import Styles from './styles'

const RestoreWallet: React.FC = () => {
  const history = useHistory()

  const [isInvalidFile, setInvalidFile] = React.useState<boolean>(false)
  const [backupData, setBackupData] = React.useState<null | string>(null)
  const [isAgreed, setIsAgreed] = React.useState<boolean>(true)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'fail'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)

  const onDrop = React.useCallback(async (acceptedFiles) => {
    const text = await acceptedFiles[0]?.text()

    if (text?.length > 0 && acceptedFiles[0].name.indexOf('.dat') !== -1) {
      setBackupData(text)
    } else {
      setInvalidFile(true)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
          history.replace('/wallets')
        } else {
          setActiveDrawer('fail')
        }
      }
    }
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Restore</Styles.Title>
            <Styles.Text>You can restore your SimpleHold wallet with a backup file.</Styles.Text>

            <Styles.DNDBlock {...getRootProps()}>
              <Styles.DNDArea isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <Styles.DNDIconRow
                  isDragActive={isDragActive || backupData !== null}
                  isInvalidFile={isInvalidFile}
                >
                  {isInvalidFile ? (
                    <SVG
                      src="../../assets/icons/invalidFile.svg"
                      width={21.85}
                      height={21.85}
                      title="file"
                    />
                  ) : (
                    <SVG
                      src="../../assets/icons/file.svg"
                      width={16.85}
                      height={21.5}
                      title="file"
                    />
                  )}
                </Styles.DNDIconRow>
                {backupData ? (
                  <Styles.DNDText>The backup file is successfully loaded</Styles.DNDText>
                ) : null}
                {!backupData && !isInvalidFile ? (
                  <Styles.DNDText>
                    Drag and drop or choose a backup file to restore your wallet
                  </Styles.DNDText>
                ) : null}
                {isInvalidFile ? (
                  <Styles.DNDText>
                    The chosen file is invalid or broken, please pick another one
                  </Styles.DNDText>
                ) : null}
              </Styles.DNDArea>
            </Styles.DNDBlock>
            <AgreeTerms isAgreed={isAgreed} setIsAgreed={() => setIsAgreed(!isAgreed)} mt={24} />
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" onClick={history.goBack} isLight mr={7.5} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              ml={7.5}
              disabled={!backupData?.length || !isAgreed}
            />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Enter your password to restore the wallet."
        textInputValue={password}
        onChangeText={setPassword}
        onConfirm={onConfirmRestore}
        textInputType="password"
        inputLabel="Enter password"
        isButtonDisabled={!validatePassword(password)}
        inputErrorLabel={passwordErrorLabel}
      />
      <FailDrawer
        isActive={activeDrawer === 'fail'}
        onClose={() => setActiveDrawer(null)}
        text="The backup file is broken. We cannot restore your wallet. Check your backup file and try again."
      />
    </>
  )
}

export default RestoreWallet

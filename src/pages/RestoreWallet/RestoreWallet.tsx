import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'
import AgreeTerms from '@components/AgreeTerms'

// Modals
import RestoreWalletPasswordModal from '@modals/RestoreWalletPassword'
import FailModal from '@modals/Fail'

// Utils
import { logEvent } from '@utils/amplitude'

// Config
import { START_RESTORE_CONFIRM } from '@config/events'

// Styles
import Styles from './styles'

const RestoreWallet: React.FC = () => {
  const history = useHistory()

  const [isInvalidFile, setInvalidFile] = React.useState<boolean>(false)
  const [fileName, setFileName] = React.useState<null | string>(null)
  const [backupData, setBackupData] = React.useState<null | string>(null)
  const [activeWallet, setActiveWallet] = React.useState<null | 'enterPassword' | 'error'>(null)
  const [isAgreed, setIsAgreed] = React.useState<boolean>(false)

  const onDrop = React.useCallback(async (acceptedFiles) => {
    const text = await acceptedFiles[0]?.text()
    if (!text?.length) {
      setInvalidFile(true)
    } else {
      setFileName(acceptedFiles[0]?.name)
      setBackupData(text)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const onConfirm = (): void => {
    logEvent({
      name: START_RESTORE_CONFIRM,
    })

    setActiveWallet('enterPassword')
  }

  const onSuccessRestore = (): void => {
    history.push('/wallets')
  }

  const onErrorRestore = (): void => {
    setActiveWallet('error')
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Restore</Styles.Title>
            <Styles.Text>You can restore your SimpleHold wallet with backup file</Styles.Text>

            <Styles.DNDBlock {...getRootProps()}>
              <Styles.DNDArea isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <Styles.DNDIconRow
                  isDragActive={isDragActive || (backupData !== null && fileName !== null)}
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
                {backupData && fileName ? (
                  <Styles.DNDText>{fileName} uploaded successfully</Styles.DNDText>
                ) : null}
                {!backupData && !fileName && !isInvalidFile ? (
                  <Styles.DNDText>
                    Drag and drop or choose backup file to restore your wallet
                  </Styles.DNDText>
                ) : null}
                {isInvalidFile ? (
                  <Styles.DNDText>
                    File you chose is invalid or broken, please pick another one
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
              disabled={!backupData?.length || !fileName?.length || !isAgreed}
            />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <RestoreWalletPasswordModal
        isActive={activeWallet === 'enterPassword'}
        onClose={() => setActiveWallet(null)}
        backupData={backupData}
        onSuccess={onSuccessRestore}
        onError={onErrorRestore}
      />
      <FailModal
        isActive={activeWallet === 'error'}
        onClose={() => setActiveWallet(null)}
        text="Backup file is broken. We cannot restore your wallet. Check your backup file and try again."
      />
    </>
  )
}

export default RestoreWallet

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Modals
import RestoreWalletPasswordModal from '@modals/RestoreWalletPassword'

// Icons
import fileIcon from '@assets/icons/file.svg'

// Styles
import Styles from './styles'

interface Props {
  params: string
}

const RestoreWallet: React.FC<Props> = (props) => {
  const { params } = props

  const history = useHistory()

  const [isInvalidFile, setInvalibFile] = React.useState<boolean>(false)
  const [fileName, setFileName] = React.useState<null | string>(null)
  const [backupData, setBackupData] = React.useState<null | string>(null)
  const [activeWallet, setActiveWallet] = React.useState<null | 'enterPassword' | 'confirm'>(null)

  const onDrop = React.useCallback(async (acceptedFiles) => {
    const text = await acceptedFiles[0]?.text()
    if (!text?.length) {
      setInvalibFile(true)
    } else {
      setFileName(acceptedFiles[0]?.name)
      setBackupData(text)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const isButtonDisabled = !backupData?.length || !fileName?.length

  const onCancel = (): void => {
    history.push('/welcome')
  }

  const onConfirm = (): void => {
    setActiveWallet('enterPassword')
  }

  const onSuccessRestore = (): void => {
    history.push('/wallets')
  }

  return (
    <>
      <Styles.Wrapper>
        <Header noActions withName logoColor="#3FBB7D" withBorder />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Restore</Styles.Title>
            <Styles.Text>You can restore your SimpleHold wallet with backup file</Styles.Text>

            <Styles.DNDBlock {...getRootProps()}>
              <Styles.DNDArea isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <Styles.DNDIconRow isDragActive={isDragActive}>
                  <SVG src={fileIcon} width={16.5} height={21.5} title="file" />
                </Styles.DNDIconRow>
                {backupData && fileName ? (
                  <Styles.DNDText type="success">{fileName} uploaded successfully</Styles.DNDText>
                ) : null}
                {!backupData && !fileName && !isInvalidFile ? (
                  <Styles.DNDText>Drag and drop here or click</Styles.DNDText>
                ) : null}
                {isInvalidFile ? <Styles.DNDText type="error">Invalid file</Styles.DNDText> : null}
              </Styles.DNDArea>
            </Styles.DNDBlock>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" onClick={onCancel} isLight mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} ml={7.5} disabled={isButtonDisabled} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <RestoreWalletPasswordModal
        isActive={activeWallet === 'enterPassword'}
        onClose={() => setActiveWallet(null)}
        backupData={backupData}
        onSuccess={onSuccessRestore}
      />
    </>
  )
}

export default RestoreWallet

import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useDropzone } from 'react-dropzone'

// Assets
import invalidFileIcon from '@assets/icons/invalidFile.svg'
import fileUploadedIcon from '@assets/icons/fileUploaded.svg'
import fileIcon from '@assets/icons/file.svg'

// Styles
import Styles from './styles'

interface Props {
  isFileBroken: boolean
  isFileUploaded: boolean
  onDrop: (acceptedFiles: File[]) => void
}

const RestoreWallet: React.FC<Props> = (props) => {
  const { isFileBroken, isFileUploaded, onDrop } = props

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const getDescription = (): string => {
    if (isFileBroken) {
      return 'The chosen file is invalid or broken, please pick another one'
    }

    if (isFileUploaded) {
      return 'The backup file is successfully loaded'
    }

    return 'Drag and drop or choose a backup file to restore your wallet'
  }

  return (
    <Styles.Container {...getRootProps()}>
      <input {...getInputProps({ multiple: false })} />
      <Styles.IconRow>
        {isFileBroken ? <SVG src={invalidFileIcon} width={36.12} height={36.12} /> : null}
        {isFileUploaded ? <SVG src={fileUploadedIcon} width={26.5} height={34.8} /> : null}
        {!isFileBroken && !isFileUploaded ? (
          <SVG src={fileIcon} width={26.5} height={34.8} />
        ) : null}
      </Styles.IconRow>
      <Styles.Description isFileBroken={isFileBroken} isFileUploaded={isFileUploaded}>
        {getDescription()}
      </Styles.Description>
    </Styles.Container>
  )
}

export default RestoreWallet

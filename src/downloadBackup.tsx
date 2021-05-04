import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'

// Utils
import { download } from '@utils/backup'

// Styles
import Styles from './styles/downloadBackup.page'

const DownloadBackup: React.FC = () => {
  React.useEffect(() => {
    setTimeout(() => {
      onDownload()
    }, 2000)
  }, [])

  const onDownload = (): void => {
    const backup = localStorage.getItem('backup')

    if (backup) {
      download(backup)
      localStorage.removeItem('backupStatus')
    }
  }

  const onClose = (): void => {
    window.close()
  }

  return (
    <Styles.Wrapper>
      <Styles.Extension>
        <Styles.Header>
          <Styles.LogoRow>
            <SVG src="./assets/logo.svg" width={30} height={24} />
          </Styles.LogoRow>
          <Styles.CloseIconRow onClick={onClose}>
            <SVG src="./assets/icons/times.svg" width={15} height={15} />
          </Styles.CloseIconRow>
        </Styles.Header>
        <Styles.Body>
          <Styles.Image src="./assets/illustrate/downloadbackup.svg" />
          <Styles.Title>Download backup</Styles.Title>
          <Styles.Description>Your download will start in few seconds.</Styles.Description>
          <Styles.DownloadLink onClick={onDownload}>If not, click here</Styles.DownloadLink>

          <Styles.DividerLine />

          <Styles.QuestionBlock>
            <SVG src="./assets/icons/ask.svg" width={15} height={15} title="ask" />
            <Styles.Question>Why I see this page?</Styles.Question>
          </Styles.QuestionBlock>

          <Styles.Answer>
            There are some troubles in Chrome for Mac OS X and Firefox with uploading and
            downloading files from the extension window. To avoid problems, we need to move this
            functionality to a separate tab. Thank you for using SimpleHold.
          </Styles.Answer>
        </Styles.Body>
      </Styles.Extension>
    </Styles.Wrapper>
  )
}

render(<DownloadBackup />, document.getElementById('download-backup'))

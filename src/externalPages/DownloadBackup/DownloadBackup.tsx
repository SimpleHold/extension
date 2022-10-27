import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Utils
import { downloadBackupFile } from '@utils/backup'
import { getItem, removeItem, setItem } from '@utils/storage'
import { getUrl } from '@utils/extension'

// Styles
import Styles from './styles'

const DownloadBackup: React.FC = () => {
  React.useEffect(() => {
    checkExistPage()
    if (getItem('isLocked')) {
      return
    }

    setTimeout(() => {
      onDownload()
    }, 2000)
  }, [])

  const checkExistPage = async () => {
    const tabs = await browser.tabs.query({
      active: false,
      url: [
        getUrl('download-backup.html'),
        getUrl('connect-trezor.html'),
        getUrl('connect-ledger.html'),
      ],
    })

    if (tabs.length) {
      const mapTabIds = tabs.map((i) => i.id)
      // @ts-ignore
      await browser.tabs.remove(mapTabIds)
    }
  }

  const onDownload = (): void => {
    const backup = getItem('backup')

    if (backup) {
      downloadBackupFile(backup)
    }
  }

  const onClose = (): void => {
    window.close()
  }

  if (getItem('isLocked')) {
    return null
  }

  return (
    <ExternalPageContainer onClose={onClose} height='100%' headerStyle='white'>
      <Styles.Body>
        <Styles.Image src='../../assets/illustrate/downloadbackup.svg' />
        <Styles.Title>Download backup</Styles.Title>
        <Styles.Description>Your download will start in few seconds.</Styles.Description>
        <Styles.DownloadLink onClick={onDownload}>If not, click here</Styles.DownloadLink>

        <Styles.DividerLine />

        <Styles.QuestionBlock>
          <SVG src='../../assets/icons/ask.svg' width={15} height={15} title='ask' />
          <Styles.Question>Why I see this page?</Styles.Question>
        </Styles.QuestionBlock>

        <Styles.Answer>
          There are some troubles in Chrome for Mac OS X and Firefox with uploading and downloading
          files from the extension window. To avoid problems, we need to move this functionality to
          a separate tab. Thank you for using SimpleHold.
        </Styles.Answer>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<DownloadBackup />, document.getElementById('download-backup'))

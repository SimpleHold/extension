import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'
import Button from '@components/Button'

// Utils
import { download as downloadBackup } from '@utils/backup'
import { logEvent } from '@utils/amplitude'
import { detectBrowser, detectOS } from '@utils/detect'
import { getUrl, openWebPage } from '@utils/extension'
import { getItem, removeItem, setItem } from '@utils/storage'

// Config
import {
  ADD_ADDRESS_GENERATE_BACKUP,
  ADD_ADDRESS_IMPORT_BACKUP,
} from '@config/events'

// Icons
import linkIcon from '@assets/icons/link.svg'

// Styles
import Styles from './styles'

interface LocationState {
  from?: 'privateKey' | 'newWallet'
}

const DownloadBackup: React.FC = () => {
  const [isDownloadManually, setDownloadManually] = React.useState<boolean>(false)

  const { state } = useLocation<LocationState>()
  const history = useHistory()

  React.useEffect(() => {
    checkBrowserAndOS()
  }, [])

  const checkBrowserAndOS = () => {
    const os = detectOS()
    const browser = detectBrowser()

    if (os === 'macos' && browser === 'chrome') {
      setDownloadManually(true)
    }
  }

  const downloadFile = () => {
    if (state?.from) {
      logEvent({
        name:
          state?.from === 'privateKey' ? ADD_ADDRESS_IMPORT_BACKUP : ADD_ADDRESS_GENERATE_BACKUP,
      })
    }

    if (isDownloadManually) {
      setTimeout(() => openWebPage(getUrl('download-backup.html')), 1000)
    }

    const backup = getItem('backup')

    if (backup) {
      downloadBackup(backup)
      if (getItem("initialBackup")) {
        setItem("initialBackup", "downloaded")
      }
      removeItem('backupStatus')
      history.replace('/wallets')
    }
  }

  return (
    <Styles.Wrapper>
      <Header noActions withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Image src="../../assets/illustrate/downloadbackup.svg" alt="image" />
          <Styles.Title>Backup</Styles.Title>
          <Styles.Description>
            Please save your backup file and keep it properly as well as your password. It ensures
            access to your funds.
          </Styles.Description>
          <Link
            title="Read more about how it works"
            to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
            mt={17}
          />
        </Styles.Row>
        <Button
          label="Download a backup file"
          onClick={downloadFile}
          icon={isDownloadManually ? linkIcon : undefined}
        />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default DownloadBackup

import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'
import Button from '@components/Button'

// Utils
import { download as downloadBackup } from '@utils/backup'
import { logEvent } from '@utils/amplitude'

// Config
import {
  START_BACKUP,
  ADD_ADDRESS_GENERATE_BACKUP,
  ADD_ADDRESS_IMPORT_BACKUP,
} from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  from?: 'privateKey' | 'newWallet'
}

const DownloadBackup: React.FC = () => {
  const { state } = useLocation<LocationState>()
  const history = useHistory()

  const downloadFile = (): void => {
    if (state?.from) {
      logEvent({
        name:
          state?.from === 'privateKey' ? ADD_ADDRESS_IMPORT_BACKUP : ADD_ADDRESS_GENERATE_BACKUP,
      })
    } else {
      logEvent({
        name: START_BACKUP,
      })
    }
    const backup = localStorage.getItem('backup')
    if (backup) {
      downloadBackup(backup)
      history.push('/wallets')
    }
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Image src="../../assets/illustrate/downloadbackup.svg" alt="image" />
          <Styles.Title>Download backup</Styles.Title>
          <Styles.Description>
            Please save your backup file and keep it properly as well as password. It ensures access
            to your funds.
          </Styles.Description>
          <Link
            title="Read more about how it works."
            to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
            mt={17}
          />
        </Styles.Row>
        <Button label="Download backup file" onClick={downloadFile} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default DownloadBackup

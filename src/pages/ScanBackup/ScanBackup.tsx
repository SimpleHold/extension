import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'

// Utils
import { sha512hash } from '@utils/crypto'
import { getItem } from '@utils/storage'
import socket from '@utils/socket'

// Styles
import Styles from './styles'

const ScanBackup: React.FC = () => {
  const history = useHistory()

  const [backupHash, setBackupHash] = React.useState<string>('')

  React.useEffect(() => {
    const getBackup = getItem('backup')

    if (getBackup) {
      setBackupHash(sha512hash(getBackup))
    }
  }, [])

  React.useEffect(() => {
    socket.auth = { username: backupHash }

    socket.connect()

    socket.on('share-backup', ({ content, from }) => {
      if (content === backupHash) {
        socket.emit('share-backup', {
          content: getItem('backup'),
          to: from,
        })
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [backupHash])

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Settings" />
      <Styles.Container>
        {backupHash.length ? (
          <Styles.Row>
            <QRCode value={backupHash} size={250} />
          </Styles.Row>
        ) : null}
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default ScanBackup

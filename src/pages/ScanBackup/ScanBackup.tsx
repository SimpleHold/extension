import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'
import Button from '@components/Button'

// Utils
import { sha512hash } from '@utils/crypto'
import { getItem } from '@utils/storage'
import socket from '@utils/socket'

// Styles
import Styles from './styles'

type TSocketShareBackup = {
  mobileDeviceId: string
}

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
    if (backupHash.length) {
      socket.connect()

      socket.on(backupHash, ({ mobileDeviceId }: TSocketShareBackup) => {
        socket.emit('set-backup', {
          mobileDeviceId,
          backup: getItem('backup'),
        })
      })

      return () => {
        socket.off(backupHash)
      }
    }
  }, [backupHash])

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Settings" whiteLogo />
      <Styles.Container>
        <Styles.Row>
          {backupHash.length ? (
            <Styles.QrCodeRow>
              <QRCode value={backupHash} size={200} />
            </Styles.QrCodeRow>
          ) : null}
          <Styles.Text>Scan the QR code to restore your mobile SimpleHold wallet</Styles.Text>
        </Styles.Row>
        <Button label="Close" onClick={history.goBack} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default ScanBackup

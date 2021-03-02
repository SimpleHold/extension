import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'
import Button from '@components/Button'

// Illustrate
import downloadBackupIllustrate from '@assets/illustrate/downloadbackup.svg'

// Utils
import { encrypt } from '@utils/crypto'
import { generateWallet } from '@utils/bitcoin'
import { generate, download as downloadBackup } from '@utils/backup'
import { getWalletsFromBackup } from '@utils/wallet'

// Styles
import Styles from './styles'

interface LocationState {
  password: string
}

const DownloadBackup: React.FC = () => {
  const { state: locationState } = useLocation<LocationState>()
  const history = useHistory()

  const downloadFile = (): void => {
    const { address, privateKey } = generateWallet()
    const backup = generate(address, privateKey)
    downloadBackup(encrypt(backup, locationState.password))

    localStorage.setItem('backup', encrypt(backup, locationState.password))
    localStorage.setItem('wallets', JSON.stringify(getWalletsFromBackup(backup)))
    history.push('/wallets')
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Image src={downloadBackupIllustrate} alt="image" />
          <Styles.Title>Download backup</Styles.Title>
          <Styles.Description>
            Please save your backup file and keep it properly as well as password. It ensures access
            to your funds.
          </Styles.Description>
          <Link title="Read more about how it works." to="https://simplehold.io" mt={17} />
        </Styles.Row>
        <Button label="Download backup file" onClick={downloadFile} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default DownloadBackup

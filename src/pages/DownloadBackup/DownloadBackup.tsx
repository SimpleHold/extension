import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Icons
import askIcon from '@assets/icons/ask.svg'

// Utils
import { encrypt } from '@utils/crypto'
import { generateWallet } from '@utils/bitcoin'
import { generate } from '@utils/backup'

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
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(encrypt(backup, locationState.password))
    )
    element.setAttribute('download', 'backup.dat')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    localStorage.setItem('backup', encrypt(backup, locationState.password))
    localStorage.setItem('wallets', backup)
    history.push('/wallets')
  }

  return (
    <Styles.Wrapper>
      <Header noActions withName logoColor="#3FBB7D" />
      <Styles.Wrapper>
        <Styles.CircleRow>
          <Styles.Circle />
        </Styles.CircleRow>
        <Styles.Row>
          <Styles.Title>Download backup</Styles.Title>
          <Styles.Description>
            Please save your backup file and keep it properly as well as password. It ensures access
            to your funds.
          </Styles.Description>
          <Styles.LinkRow>
            <Styles.LinkIcon>
              <SVG src={askIcon} width={12} height={12} title="ask" />
            </Styles.LinkIcon>
            <Styles.Link>Read more about how it works.</Styles.Link>
          </Styles.LinkRow>
          <Styles.Actions>
            <Button label="Download backup file" onClick={downloadFile} />
          </Styles.Actions>
        </Styles.Row>
      </Styles.Wrapper>
    </Styles.Wrapper>
  )
}

export default DownloadBackup

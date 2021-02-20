import * as React from 'react'
import SVG from 'react-inlinesvg'
import CryptoJS from 'crypto-js'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Icons
import askIcon from '@assets/icons/ask.svg'

// Styles
import Styles from './styles'

const mockData = {
  wallets: [
    {
      symbol: 'btc',
      balance: '0',
      address: '16ftSEQ4ctQFDtVZiUBusQUjRrGhM3JYwe',
      uuid: '88750a2e',
      privateKey: '123',
    },
  ],
  version: 1,
  uuid: 'uuid',
}

const DownloadBackup: React.FC = () => {
  const downloadFile = (): void => {
    const encryptData = CryptoJS.AES.encrypt(JSON.stringify(mockData), '12345678').toString()
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encryptData))
    element.setAttribute('download', 'backup.dat')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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

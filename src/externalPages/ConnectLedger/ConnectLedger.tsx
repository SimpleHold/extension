import * as React from 'react'
import { render } from 'react-dom'
import type Transport from '@ledgerhq/hw-transport'

// Utils
import { requestTransport, getBTCAddress, getETHAddress, getXRPAddress } from '@utils/ledger'

// Components
import Button from '@components/Button'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Styles
import Styles from './styles'

const ConnectLedger: React.FC = () => {
  const [ledgerTransport, setLedgerTransport] = React.useState<Transport | null>(null)

  const onClose = (): void => {
    window.close()
  }

  const onConnect = async () => {
    try {
      const transport = await requestTransport()

      console.log('transport', transport)

      if (transport) {
        setLedgerTransport(transport)
      } else {
        alert('ERROR')
      }
    } catch (err) {
      console.log('onConnectLedger error', err)
    }
  }

  const onGetBTC = async () => {
    if (ledgerTransport) {
      const address = await getBTCAddress(0, ledgerTransport)

      console.log('btc address', address)
    }
  }

  const onGetETH = async () => {
    if (ledgerTransport) {
      const address = await getETHAddress(0, ledgerTransport)

      console.log('eth address', address)
    }
  }

  const onGetXRP = async () => {
    if (ledgerTransport) {
      const address = await getXRPAddress(0, ledgerTransport)

      console.log('xrp address', address)
    }
  }

  const getAddress = (symbol: string) => (): void => {
    if (symbol === 'btc') {
      onGetBTC()
    } else if (symbol === 'eth') {
      onGetETH()
    } else {
      onGetXRP()
    }
  }

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <Styles.Wrapper>
        <Styles.Container>
          <Styles.Row>
            <Styles.ConnectImage />
            <Styles.Title>Connect ledger</Styles.Title>
            <Styles.Description>
              Follow the instructions on the service page. Follow the instructions
            </Styles.Description>
            <p onClick={getAddress('btc')}>Get btc address</p>
            <p onClick={getAddress('eth')}>Get eth address</p>
            <p onClick={getAddress('xrp')}>Get xrp address</p>
          </Styles.Row>
          <Button label="Connect" onClick={onConnect} />
        </Styles.Container>
      </Styles.Wrapper>
    </ExternalPageContainer>
  )
}

render(<ConnectLedger />, document.getElementById('connect-ledger'))

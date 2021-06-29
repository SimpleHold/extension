import * as React from 'react'
import { render } from 'react-dom'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import TrezorConnect from 'trezor-connect'

// Styles
import Styles from './styles'

const ConnectHardwareWallet: React.FC = () => {
  React.useEffect(() => {
    initTrezor()
  }, [])

  const initTrezor = async (): Promise<void> => {
    await TrezorConnect.init({
      manifest: {
        email: 'developer@xyz.com',
        appUrl: 'http://your.application.com',
      },
    })
  }

  const onConnectLedger = async () => {
    try {
      const transport = await TransportWebUSB.request()

      console.log('transport', transport)
    } catch (err) {
      console.log('onConnectLedger error', err)
    }
  }

  const onConnectTrezor = async () => {
    const result = await TrezorConnect.requestLogin({
      callback: () => {
        return {
          challengeHidden: '0123456789abcdef',
          challengeVisual: 'Login to',
        }
      },
    })

    console.log('result', result)
  }

  return (
    <Styles.Wrapper>
      <div onClick={onConnectLedger}>
        <p>Connect ledger</p>
      </div>
      <hr />
      <div onClick={onConnectTrezor}>
        <p>Connect trezor</p>
      </div>
    </Styles.Wrapper>
  )
}

render(<ConnectHardwareWallet />, document.getElementById('connect-hardware-wallet'))

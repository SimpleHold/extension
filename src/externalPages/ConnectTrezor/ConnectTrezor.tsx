import * as React from 'react'
import { render } from 'react-dom'
import TrezorConnect from 'trezor-connect'

// Styles
import Styles from './styles'

const ConnectTrezor: React.FC = () => {
  const onConnectTrezor = async () => {
    await TrezorConnect.init({
      manifest: {
        email: 'admin@simplehold.io',
        appUrl: 'simplehold-extension',
      },
      hostLabel: 'SimpleHold',
    })

    const btc = await TrezorConnect.getAddress({
      bundle: [{ path: "m/49'/0'/0'/0/0", showOnTrezor: false }],
    })
  }

  return (
    <Styles.Wrapper>
      <div onClick={onConnectTrezor}>
        <p>Connect trezor</p>
      </div>
    </Styles.Wrapper>
  )
}

render(<ConnectTrezor />, document.getElementById('connect-trezor'))

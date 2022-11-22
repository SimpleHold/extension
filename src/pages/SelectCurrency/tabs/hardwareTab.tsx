import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import trezorLogo from '@assets/hardware/trezor.svg'
import ledgerLogo from '@assets/hardware/ledger.svg'

// Styles
import Styles from '../styles'

interface Props {
  onConnect: (type: 'trezor' | 'ledger') => () => void
}

const HardwareTab: React.FC<Props> = (props) => {
  const { onConnect } = props

  return (
    <Styles.Tab>
      <Styles.HardwareWallets>
        <Styles.HardwareWallet onClick={onConnect('trezor')}>
          <SVG src={trezorLogo} width={80} height={22} />
        </Styles.HardwareWallet>
        <Styles.HardwareWallet onClick={onConnect('ledger')}>
          <SVG src={ledgerLogo} width={80} height={22} />
        </Styles.HardwareWallet>
      </Styles.HardwareWallets>
    </Styles.Tab>
  )
}

export default HardwareTab

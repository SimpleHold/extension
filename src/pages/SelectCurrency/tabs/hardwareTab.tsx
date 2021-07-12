import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from '../styles'

interface Props {
  onConnect: (type: 'trezor' | 'ledger') => () => void
}

const HardwareTab: React.FC<Props> = (props) => {
  const { onConnect } = props

  return (
    <Styles.Tab>
      <Styles.HardwareWallets onClick={onConnect('trezor')}>
        <Styles.HardwareWallet>
          <SVG src="../../../assets/hardware/trezor.svg" width={80} height={22} />
        </Styles.HardwareWallet>
      </Styles.HardwareWallets>
    </Styles.Tab>
  )
}

export default HardwareTab

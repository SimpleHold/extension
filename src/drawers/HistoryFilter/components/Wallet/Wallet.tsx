import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import CheckBox from '@components/CheckBox'
import HardwareLogo from '@components/HardwareLogo'

// Types
import { THardware } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  walletName: string
  address: string
  isActive: boolean
  onToggle: () => void
  chain?: string
  hardware?: THardware
}

const Wallet: React.FC<Props> = (props) => {
  const { symbol, walletName, address, isActive, onToggle, chain, hardware } = props

  return (
    <Styles.Container>
      <CurrencyLogo size={40} br={13} symbol={symbol} chain={chain} />
      <Styles.Row>
        <Styles.Currency>
          <Styles.WalletNameRow>
            <HardwareLogo size={12} mr={4} type={hardware?.type} color="#7D7E8D" />
            <Styles.WalletName>{walletName}</Styles.WalletName>
          </Styles.WalletNameRow>
          <Styles.Address>{address}</Styles.Address>
        </Styles.Currency>
        <Styles.CheckBoxRow>
          <CheckBox value={isActive} size={16} onClick={onToggle} />
        </Styles.CheckBoxRow>
      </Styles.Row>
    </Styles.Container>
  )
}

export default Wallet

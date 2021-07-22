import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  openPage: (url: string) => () => void
  symbol: string
  chain?: string
}

const WalletCard: React.FC<Props> = (props) => {
  const { openPage, symbol, chain } = props

  return (
    <Styles.Container>
      <Styles.Body>
        <CurrencyLogo width={60} height={60} br={18} symbol={symbol} chain={chain} />
        <Styles.WalletInfo>
          <Styles.BalanceRow>
            <Styles.Balance>0.16823857 {toUpper(symbol)}</Styles.Balance>
            <Styles.RefreshIcon />
          </Styles.BalanceRow>
          <Styles.Estimated>$ 5,712.75</Styles.Estimated>
        </Styles.WalletInfo>
      </Styles.Body>
      <Styles.Actions>
        <Styles.ActionButton onClick={openPage('/send')}>
          <Styles.ActionName>Send</Styles.ActionName>
        </Styles.ActionButton>
        <Styles.ActionButton onClick={openPage('/receive')}>
          <Styles.ActionName>Receive</Styles.ActionName>
        </Styles.ActionButton>
      </Styles.Actions>
    </Styles.Container>
  )
}

export default WalletCard

import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

interface Props {}

const WalletCard: React.FC<Props> = (props) => {
  const {} = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  return (
    <Styles.Container ref={ref}>
      <Styles.Row>
        <CurrencyLogo width={40} height={40} br={13} symbol="btc" />
        <Styles.Info>
          <Styles.WalletNameRow>
            <Styles.WalletName>Wallet name</Styles.WalletName>
            <Styles.ArrowIcon />
          </Styles.WalletNameRow>
          <Styles.Balances>
            <Styles.Balance>0.16823857 BTC</Styles.Balance>
            <Styles.Estimated>$ 5,712.75</Styles.Estimated>
          </Styles.Balances>
        </Styles.Info>
      </Styles.Row>
    </Styles.Container>
  )
}

export default WalletCard

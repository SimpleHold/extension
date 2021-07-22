import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {}

const Transaction: React.FC<Props> = (props) => {
  const {} = props

  return (
    <Styles.Container>
      <Styles.Info>
        <Styles.DestinationType />
        <Styles.InfoRow>
          <Styles.DestinationAddress>1y3e...k9kt</Styles.DestinationAddress>
          <Styles.Date>Jun 30</Styles.Date>
        </Styles.InfoRow>
      </Styles.Info>
      <Styles.Amounts>
        <Styles.CurrencyAmount>+ 0.168 BTC</Styles.CurrencyAmount>
        <Styles.USDAmount>$ 5,712.75</Styles.USDAmount>
      </Styles.Amounts>
    </Styles.Container>
  )
}

export default Transaction

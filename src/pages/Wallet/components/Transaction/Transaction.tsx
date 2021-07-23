import * as React from 'react'
import numeral from 'numeral'

// Utils
import { toUpper, price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  type: 'spend' | 'received'
  date: string
  destination: string
  amount: number
  estimated: number
  symbol: string
}

const Transaction: React.FC<Props> = (props) => {
  const { type, date, destination, amount, estimated, symbol } = props

  return (
    <Styles.Container>
      <Styles.Info>
        <Styles.DestinationType />
        <Styles.InfoRow>
          <Styles.DestinationAddress>{destination}</Styles.DestinationAddress>
          <Styles.Date>{date}</Styles.Date>
        </Styles.InfoRow>
      </Styles.Info>
      <Styles.Amounts>
        <Styles.CurrencyAmount>{`${numeral(amount).format('0.[000000]')} ${toUpper(
          symbol
        )}`}</Styles.CurrencyAmount>
        <Styles.USDAmount>{`$${price(estimated, 2)}`}</Styles.USDAmount>
      </Styles.Amounts>
    </Styles.Container>
  )
}

export default Transaction

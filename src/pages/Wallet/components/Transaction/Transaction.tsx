import * as React from 'react'
import numeral from 'numeral'
import dayjs from 'dayjs'

// Utils
import { toUpper, price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  data?: {
    type: 'spend' | 'received'
    date: string
    destination: string
    amount: number
    estimated: number
    symbol: string
  }
  isLoading?: boolean
}

const Transaction: React.FC<Props> = (props) => {
  const { data, isLoading } = props

  if (isLoading) {
    return (
      <Styles.Container>
        <p>23123</p>
      </Styles.Container>
    )
  }

  if (data) {
    const { type, date, destination, amount, estimated, symbol } = data

    return (
      <Styles.Container>
        <Styles.Info>
          <Styles.DestinationType />
          <Styles.InfoRow>
            <Styles.DestinationAddress>{destination}</Styles.DestinationAddress>
            <Styles.Date>{dayjs(date).format('MMM D')}</Styles.Date>
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

  return null
}

export default Transaction

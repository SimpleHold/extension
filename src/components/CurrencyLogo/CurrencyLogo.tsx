import * as React from 'react'

import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

interface Props {
  width: number
  height: number
  symbol: string
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { width, height, symbol } = props

  const currency = getCurrency(symbol)

  if (currency) {
    return (
      <Styles.Container width={width} height={height}>
        <Styles.Logo source={currency.logo} />
      </Styles.Container>
    )
  }

  return null
}

export default CurrencyLogo

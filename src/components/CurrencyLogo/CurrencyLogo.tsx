import * as React from 'react'

import { getLogo } from '../../config/currencies'

// Styles
import Styles from './styles'

interface Props {
  width: number
  height: number
  symbol: string
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { width, height, symbol } = props

  const logo = getLogo(symbol)

  if (logo) {
    return (
      <Styles.Container width={width} height={height}>
        <Styles.Logo source={logo.logo} />
      </Styles.Container>
    )
  }

  return null
}

export default CurrencyLogo

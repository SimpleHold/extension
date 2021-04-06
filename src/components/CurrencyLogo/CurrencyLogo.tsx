import * as React from 'react'

import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface Props {
  width: number
  height: number
  symbol: string
  br?: number
  platform?: 'eth' | 'bsc'
  letter?: string
  hideLogo?: boolean
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { width, height, symbol, br, platform, letter, hideLogo } = props

  const getPlatformLogo = platform ? getCurrency(platform) : null
  const currency = getCurrency(symbol)

  const containerWidth = typeof platform !== 'undefined' ? width + 5 : width
  const containerHeight = typeof platform !== 'undefined' ? height + 5 : height

  return (
    <Styles.Container width={containerWidth} height={containerHeight}>
      {currency ? (
        <Styles.LogoRow width={width} height={height} background={currency.background} br={br}>
          {letter ? <Styles.LetterLogo>{letter}</Styles.LetterLogo> : null}
          {!letter && !hideLogo ? (
            <Styles.Logo src={currency.logo} width={width / 2} height={height / 2} />
          ) : null}
        </Styles.LogoRow>
      ) : null}
      {getPlatformLogo ? (
        <Styles.TokenRow>
          <Styles.TokenLogo src={getPlatformLogo.logo} />
        </Styles.TokenRow>
      ) : null}
    </Styles.Container>
  )
}

export default CurrencyLogo

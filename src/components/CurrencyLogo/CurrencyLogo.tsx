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
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { width, height, symbol, br, platform } = props

  if (platform) {
    const token = getToken(symbol, platform)
    const platformLogo = getCurrency(platform)

    if (token) {
      return (
        <Styles.Container width={width} height={height} background={token.background} br={br}>
          <Styles.LogoRow>
            <Styles.Logo source={token.logo} width={width} height={height} />
            {platformLogo ? (
              <Styles.PlatformLogoRow>
                <Styles.PlatformLogo source={platformLogo.logo} />
              </Styles.PlatformLogoRow>
            ) : null}
          </Styles.LogoRow>
        </Styles.Container>
      )
    }
  }

  const currency = getCurrency(symbol)

  if (currency) {
    return (
      <Styles.Container width={width} height={height} background={currency.background} br={br}>
        <Styles.Logo source={currency.logo} width={width} height={height} />
      </Styles.Container>
    )
  }

  return null
}

export default CurrencyLogo

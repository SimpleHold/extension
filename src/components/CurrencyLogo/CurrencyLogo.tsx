import * as React from 'react'

// Config
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface Props {
  width: number
  height: number
  symbol: string
  br?: number
  chain?: string
  letter?: string
  isToken?: boolean
  background?: string
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { width, height, symbol, br, chain, letter, isToken, background } = props

  const getChainogo = chain ? getCurrencyByChain(chain) : null
  const currency = isToken && chain ? getToken(symbol, chain) : getCurrency(symbol)

  const containerWidth = typeof chain !== 'undefined' ? width + 5 : width
  const containerHeight = typeof chain !== 'undefined' ? height + 5 : height

  return (
    <Styles.Container width={containerWidth} height={containerHeight}>
      {currency ? (
        <Styles.LogoRow
          width={width}
          height={height}
          background={background || currency.background}
          br={br}
        >
          {letter?.length ? (
            <Styles.LetterLogo>{letter}</Styles.LetterLogo>
          ) : (
            <Styles.Logo src={currency.logo} width={width / 2} height={height / 2} />
          )}
        </Styles.LogoRow>
      ) : null}
      {getChainogo ? (
        <Styles.TokenRow>
          <Styles.TokenLogo src={getChainogo.logo} />
        </Styles.TokenRow>
      ) : null}
    </Styles.Container>
  )
}

export default CurrencyLogo

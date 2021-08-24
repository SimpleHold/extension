import * as React from 'react'

// Config
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Utils
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  size: number
  symbol: string
  br?: number
  chain?: string
  background?: string
  name?: string
}

const CurrencyLogo: React.FC<Props> = (props) => {
  const { size, symbol, br, chain, background, name } = props

  const getChainogo = chain ? getCurrencyByChain(chain) : null
  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  return (
    <Styles.Container width={size} height={size}>
      <Styles.LogoRow
        width={size}
        height={size}
        background={background || currency?.background || getChainogo?.background}
        br={br}
      >
        {currency ? <Styles.Logo src={currency.logo} width={size / 2} height={size / 2} /> : null}
        {!currency && name?.length ? (
          <Styles.LetterLogo>{toUpper(name[0])}</Styles.LetterLogo>
        ) : null}
      </Styles.LogoRow>
      {getChainogo ? (
        <Styles.TokenRow size={size}>
          <Styles.TokenLogo size={size} src={getChainogo.logo} />
        </Styles.TokenRow>
      ) : null}
    </Styles.Container>
  )
}

export default CurrencyLogo

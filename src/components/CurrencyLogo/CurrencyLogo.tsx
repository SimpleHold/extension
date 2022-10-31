import * as React from 'react'

// Config
import { getCurrencyInfo, getCurrencyByChain } from '@config/currencies/utils'
import { getToken } from '@tokens/index'

// Utils
import { toUpper } from '@utils/format'
import { getToken as getLocalToken } from '@utils/localTokens'

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

  const [logo, setLogo] = React.useState<string | null>(null)

  const getChainLogo = chain ? getCurrencyByChain(chain) : null
  const currency = chain ? getToken(symbol, chain) : getCurrencyInfo(symbol)

  React.useEffect(() => {
    checkLocalLogo()
  }, [])

  const checkLocalLogo = (): void => {
    if (chain) {
      const find = getLocalToken(chain, symbol)

      if (find) {
        setLogo(find.logo)
      }
    }
  }

  return (
    <Styles.Container width={size} height={size}>
      <Styles.LogoRow
        width={size}
        height={size}
        background={background || currency?.background || getChainLogo?.background}
        br={br}
      >
        {currency || logo ? (
          <Styles.Logo src={logo || currency?.logo} width={size / 2} height={size / 2} />
        ) : null}
        {!currency && !logo && name?.length ? (
          <Styles.LetterLogo>{toUpper(name[0])}</Styles.LetterLogo>
        ) : null}
      </Styles.LogoRow>
      {getChainLogo ? (
        <Styles.TokenRow size={size}>
          <Styles.TokenLogo size={size} src={getChainLogo.logo} />
        </Styles.TokenRow>
      ) : null}
    </Styles.Container>
  )
}

export default CurrencyLogo

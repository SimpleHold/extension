import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Config
import { getToken } from '@config/tokens'

// Uitls
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  chain: string
  isActive?: boolean
  hideSelect?: boolean
  onToggle?: () => void
  name?: string
}

const TokenCard: React.FC<Props> = (props) => {
  const { symbol, chain, isActive, hideSelect, onToggle, name } = props

  const tokenInfo = getToken(symbol, chain)

  if (tokenInfo || name) {
    return (
      <Styles.Container>
        <CurrencyLogo width={40} height={40} symbol={symbol} chain={chain} name={name} />
        <Styles.Row>
          <Styles.Info>
            <Styles.TokenName>{tokenInfo?.name || name}</Styles.TokenName>
            <Styles.TokenSymbol>{toUpper(symbol)}</Styles.TokenSymbol>
          </Styles.Info>
          {!hideSelect && typeof isActive !== 'undefined' && onToggle ? (
            <RadioButton isActive={isActive} onToggle={onToggle} />
          ) : null}
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default TokenCard

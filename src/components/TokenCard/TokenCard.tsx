import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Config
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  platform: string
  isActive?: boolean
  hideSelect?: boolean
  onToggle?: () => void
}

const TokenCard: React.FC<Props> = (props) => {
  const { symbol, platform, isActive, hideSelect, onToggle } = props

  const tokenInfo = getToken(symbol, platform)

  if (tokenInfo) {
    return (
      <Styles.Container>
        <CurrencyLogo width={40} height={40} symbol={symbol} chain={platform} isToken />
        <Styles.Row>
          <Styles.Info>
            <Styles.TokenName>{tokenInfo.name}</Styles.TokenName>
            <Styles.TokenSymbol>{symbol}</Styles.TokenSymbol>
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

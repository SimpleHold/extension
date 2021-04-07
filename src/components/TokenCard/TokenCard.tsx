import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Styles
import Styles from './styles'

interface Props {
  name: string
  symbol: string
  platform: 'eth' | 'bsc'
  isActive: boolean
}

const TokenCard: React.FC<Props> = (props) => {
  const { name, symbol, platform, isActive } = props

  return (
    <Styles.Container>
      <CurrencyLogo width={40} height={40} symbol={symbol} platform={platform} isToken />
      <Styles.Row>
        <Styles.Info>
          <Styles.TokenName>{name}</Styles.TokenName>
          <Styles.TokenSymbol>{symbol}</Styles.TokenSymbol>
        </Styles.Info>
        <RadioButton isActive={isActive} />
      </Styles.Row>
    </Styles.Container>
  )
}

export default TokenCard

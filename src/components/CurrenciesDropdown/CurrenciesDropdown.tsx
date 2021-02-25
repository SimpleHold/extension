import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  isDisabled: boolean
}

const CurrenciesDropdown: React.FC<Props> = (props) => {
  const { symbol, isDisabled } = props

  return (
    <Styles.Container isDisabled={isDisabled}>
      <CurrencyLogo symbol={symbol} width={40} height={40} />
      <Styles.Row>
        <Styles.Address>16RaFNHHYsrX9ryh85HaYeC8sMG3tfA3R7</Styles.Address>
        {!isDisabled ? (
          <Styles.Button>
            <Styles.ArrowIcon />
          </Styles.Button>
        ) : null}
      </Styles.Row>
    </Styles.Container>
  )
}

export default CurrenciesDropdown

import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper } from '@utils/format'

// Config
import currencies, { ICurrency } from '@config/currencies'

// Styles
import Styles from './styles'

const Receive: React.FC = () => {
  const history = useHistory()

  const [selectedCurrency, setSelectedCurrency] = React.useState<null | ICurrency>(null)

  const onAddAddress = (): void => {
    if (selectedCurrency) {
      const { symbol } = selectedCurrency

      history.push('/new-wallet', {
        symbol,
      })
    }
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Wallets" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Select currency</Styles.Title>
          <Styles.CurrenciesList>
            {currencies.map((currency: ICurrency) => {
              const { name, symbol } = currency
              const isActive = selectedCurrency?.symbol === symbol

              return (
                <Styles.CurrencyBlock
                  key={symbol}
                  onClick={() => setSelectedCurrency(currency)}
                  isActive={isActive}
                >
                  <CurrencyLogo symbol={symbol} width={40} height={40} br={10} />
                  <Styles.CurrencyName>{name}</Styles.CurrencyName>
                  <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
                </Styles.CurrencyBlock>
              )
            })}
          </Styles.CurrenciesList>
        </Styles.Row>
        <Styles.Actions>
          <Button label="Add address" disabled={!selectedCurrency} onClick={onAddAddress} />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Receive

import * as React from 'react'

// Components
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper, toLower } from '@utils/format'

// Config
import currencies, { ICurrency } from '@config/currencies'

// Styles
import Styles from '../styles'

interface Props {
  onAddAddress: (symbol: string) => () => void
}

const CurrenciesTab: React.FC<Props> = (props) => {
  const { onAddAddress } = props

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterCurrenciesList = currencies.filter((currency: ICurrency) => {
    if (searchValue.length) {
      const findByName = toLower(currency.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(currency.symbol)?.indexOf(toLower(searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return currency
  })

  return (
    <Styles.Tab>
      <TextInput
        value={searchValue}
        label="Type a currency or a ticker"
        onChange={setSearchValue}
        type="text"
      />

      {!filterCurrenciesList.length ? (
        <Styles.NotFoundMessage>
          The currency was not found but you can add a custom token
        </Styles.NotFoundMessage>
      ) : null}

      <Styles.CurrenciesList>
        {filterCurrenciesList.map((currency: ICurrency) => {
          const { name, symbol } = currency

          return (
            <Styles.CurrencyBlock key={symbol} onClick={onAddAddress(symbol)}>
              <CurrencyLogo symbol={symbol} size={40} br={10} />
              <Styles.CurrencyName>{name}</Styles.CurrencyName>
              <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
            </Styles.CurrencyBlock>
          )
        })}
      </Styles.CurrenciesList>
    </Styles.Tab>
  )
}

export default CurrenciesTab

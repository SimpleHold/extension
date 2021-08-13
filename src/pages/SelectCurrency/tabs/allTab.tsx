import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper, toLower } from '@utils/format'

// Config
import tokens, { IToken } from '@config/tokens'
import currencies, { ICurrency } from '@config/currencies'

// Styles
import Styles from '../styles'

interface Props {
  onAddCustomToken: () => void
  onAddToken: (symbol: string, chain: string, tokenName: string) => () => void
  onAddAddress: (symbol: string) => () => void
}

const AllTab: React.FC<Props> = (props) => {
  const { onAddCustomToken, onAddToken, onAddAddress } = props

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterTokensList = tokens.filter((token: IToken) => {
    if (searchValue.length) {
      const findByName = toLower(token.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(token.symbol)?.indexOf(toLower(searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return token
  })

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

      {!filterTokensList.length && !filterCurrenciesList.length ? (
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
        <Styles.CurrencyBlock onClick={onAddCustomToken}>
          <Styles.CustomTokenLogo>
            <SVG src="../../../assets/icons/plusCircle.svg" width={20} height={20} />
          </Styles.CustomTokenLogo>
          <Styles.CustomTokenLabel>Add Custom Token</Styles.CustomTokenLabel>
        </Styles.CurrencyBlock>
        {filterTokensList.map((token: IToken) => {
          const { name, symbol, chain } = token

          return (
            <Styles.CurrencyBlock
              key={`${symbol}/${chain}`}
              onClick={onAddToken(symbol, chain, name)}
            >
              <CurrencyLogo symbol={symbol} size={40} br={10} chain={chain} />
              <Styles.CurrencyName>{name}</Styles.CurrencyName>
              <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
            </Styles.CurrencyBlock>
          )
        })}
      </Styles.CurrenciesList>
    </Styles.Tab>
  )
}

export default AllTab

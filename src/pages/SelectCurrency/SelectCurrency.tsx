import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper } from '@utils/format'

// Config
import currencies, { ICurrency } from '@config/currencies'
import tokens, { IToken } from '@config/tokens'

// Styles
import Styles from './styles'

const SelectCurrency: React.FC = () => {
  const history = useHistory()

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterCurrenciesList = [...currencies, ...tokens].filter((currency: ICurrency | IToken) => {
    if (searchValue.length) {
      const findByName = currency.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      const findBySymbol = currency.symbol.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1

      return findByName || findBySymbol
    }
    return currency
  })

  const onAddAddress = (symbol: string): void => {
    history.push('/new-wallet', {
      symbol,
    })
  }

  const onAddCustomToken = (): void => {
    history.push('/add-custom-token')
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Wallets" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Select currency</Styles.Title>

          <TextInput
            value={searchValue}
            label="Type a currency or ticker"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearchValue(e.target.value)
            }
          />

          <Styles.CurrenciesList>
            {currencies.map((currency: ICurrency) => {
              const { name, symbol } = currency

              return (
                <Styles.CurrencyBlock key={symbol} onClick={() => onAddAddress(symbol)}>
                  <CurrencyLogo symbol={symbol} width={40} height={40} br={10} />
                  <Styles.CurrencyName>{name}</Styles.CurrencyName>
                  <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
                </Styles.CurrencyBlock>
              )
            })}

            {tokens.map((currency: IToken) => {
              const { name, symbol, platform } = currency

              return (
                <Styles.CurrencyBlock key={symbol} onClick={() => onAddAddress(symbol)}>
                  <CurrencyLogo
                    symbol={symbol}
                    width={40}
                    height={40}
                    br={10}
                    platform={platform}
                  />
                  <Styles.CurrencyName>{name}</Styles.CurrencyName>
                  <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
                </Styles.CurrencyBlock>
              )
            })}

            <Styles.CurrencyBlock onClick={onAddCustomToken}>
              <Styles.CustomTokenLogo>
                <SVG
                  src="../../assets/icons/plusCircle.svg"
                  width={20}
                  height={20}
                  title="Create new wallet"
                />
              </Styles.CustomTokenLogo>
              <Styles.CustomTokenLabel>Add Custom Token</Styles.CustomTokenLabel>
            </Styles.CurrencyBlock>
          </Styles.CurrenciesList>
        </Styles.Row>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SelectCurrency

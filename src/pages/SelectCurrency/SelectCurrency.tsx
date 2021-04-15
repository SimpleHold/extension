import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toUpper, toLower } from '@utils/format'
import { getWallets } from '@utils/wallet'

// Config
import currencies, { ICurrency } from '@config/currencies'
import tokens, { IToken, checkExistWallet } from '@config/tokens'

// Styles
import Styles from './styles'

const SelectCurrency: React.FC = () => {
  const history = useHistory()

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterCurrenciesList = currencies.filter((currency: ICurrency) => {
    if (searchValue.length) {
      const findByName = toLower(currency.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(currency.symbol)?.indexOf(toLower(searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return currency
  })

  const filterTokensList = tokens.filter((token: IToken) => {
    if (searchValue.length) {
      const findByName = toLower(token.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(token.symbol)?.indexOf(toLower(searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return token
  })

  const onAddAddress = (symbol: string): void => {
    history.push('/new-wallet', {
      symbol,
    })
  }

  const onAddToken = (symbol: string, chain: string): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      if (checkTokenWallets) {
        return history.push('/add-token-to-address', {
          symbol,
          chain,
        })
      }

      return history.push('/new-wallet', {
        symbol,
        chain,
      })
    }
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
            onChange={setSearchValue}
          />

          {!filterCurrenciesList.length && !filterTokensList.length ? (
            <Styles.NotFoundMessage>
              Currency was not found but you can add custom token
            </Styles.NotFoundMessage>
          ) : null}

          <Styles.CurrenciesList>
            {filterCurrenciesList.map((currency: ICurrency) => {
              const { name, symbol } = currency

              return (
                <Styles.CurrencyBlock key={symbol} onClick={() => onAddAddress(symbol)}>
                  <CurrencyLogo symbol={symbol} width={40} height={40} br={10} />
                  <Styles.CurrencyName>{name}</Styles.CurrencyName>
                  <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
                </Styles.CurrencyBlock>
              )
            })}

            {filterTokensList.map((token: IToken) => {
              const { name, symbol, chain } = token

              return (
                <Styles.CurrencyBlock key={symbol} onClick={() => onAddToken(symbol, chain)}>
                  <CurrencyLogo
                    symbol={symbol}
                    width={40}
                    height={40}
                    br={10}
                    chain={chain}
                    isToken
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

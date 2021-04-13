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
import { getWallets, IWallet } from '@utils/wallet'

// Config
import currencies, { ICurrency } from '@config/currencies'
import tokens, { IToken } from '@config/tokens'

// Styles
import Styles from './styles'

const SelectCurrency: React.FC = () => {
  const history = useHistory()

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterCurrenciesList = currencies.filter((currency: ICurrency) => {
    if (searchValue.length) {
      const findByName = currency.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      const findBySymbol = currency.symbol.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1

      return findByName || findBySymbol
    }
    return currency
  })

  const filterTokensList = tokens.filter((token: IToken) => {
    if (searchValue.length) {
      const findByName = token.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      const findBySymbol = token.symbol.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1

      return findByName || findBySymbol
    }
    return token
  })

  const onAddAddress = (symbol: string): void => {
    history.push('/new-wallet', {
      symbol,
    })
  }

  const onAddToken = (symbol: string, platform: string): void => {
    const walletsList = getWallets()

    const checkExistWallet = walletsList?.filter(
      (wallet: IWallet) =>
        toLower(wallet.platform) === toLower(platform) && toLower(wallet.symbol) === toLower(symbol)
    )
    const getAllWalletsByPlatform = walletsList?.filter(
      (wallet: IWallet) => toLower(wallet.platform) === toLower(platform)
    )

    if (checkExistWallet?.length && getAllWalletsByPlatform?.length === 1) {
      return history.push('/new-wallet', {
        symbol,
        platform,
      })
    }

    return history.push('/add-token-to-address', {
      symbol,
      platform,
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
              const { name, symbol, platform } = token

              return (
                <Styles.CurrencyBlock key={symbol} onClick={() => onAddToken(symbol, platform)}>
                  <CurrencyLogo
                    symbol={symbol}
                    width={40}
                    height={40}
                    br={10}
                    chain={platform}
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

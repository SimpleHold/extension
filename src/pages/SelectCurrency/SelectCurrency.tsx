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
import * as theta from '@utils/currencies/theta'
import { getUrl, openWebPage } from '@utils/extension'

// Config
import currencies, { ICurrency } from '@config/currencies'
import tokens, { IToken, checkExistWallet } from '@config/tokens'
import networks, { IEthNetwork } from '@config/ethLikeNetworks'

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

  const getWarning = (symbol: string): string | undefined => {
    if (theta.coins.indexOf(symbol) !== -1) {
      return `You are trying to add a new ${
        toLower(symbol) === 'theta' ? 'Theta' : 'TFuel'
      } address. The same address for ${
        toLower(symbol) === 'theta' ? 'TFuel' : 'Theta'
      } will also be added to your wallet.`
    }
    return undefined
  }

  const onAddAddress = (symbol: string) => (): void => {
    const warning = getWarning(symbol)

    history.push('/new-wallet', {
      symbol,
      warning,
    })
  }

  const onAddToken = (symbol: string, chain: string, tokenName: string) => (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      const getNetwork = networks.find(
        (network: IEthNetwork) => toLower(network.chain) === toLower(chain)
      )

      if (getNetwork && checkTokenWallets) {
        return history.push('/add-token-to-address', {
          symbol,
          chain,
          chainName: getNetwork.name,
          tokenName,
          tokenStandart: toLower(getNetwork.chain) === 'bsc' ? 'BEP20' : 'ERC20',
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

  const onConnectHardwareWallet = async () => {
    openWebPage(getUrl('connect-hardware-wallet.html'))
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
            label="Type a currency or a ticker"
            onChange={setSearchValue}
          />

          <p onClick={onConnectHardwareWallet}>Connect hardware wallet</p>

          {!filterCurrenciesList.length && !filterTokensList.length ? (
            <Styles.NotFoundMessage>
              The currency was not found but you can add a custom token
            </Styles.NotFoundMessage>
          ) : null}

          <Styles.CurrenciesList>
            {filterCurrenciesList.map((currency: ICurrency) => {
              const { name, symbol } = currency

              return (
                <Styles.CurrencyBlock key={symbol} onClick={onAddAddress(symbol)}>
                  <CurrencyLogo symbol={symbol} width={40} height={40} br={10} />
                  <Styles.CurrencyName>{name}</Styles.CurrencyName>
                  <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
                </Styles.CurrencyBlock>
              )
            })}

            {filterTokensList.map((token: IToken) => {
              const { name, symbol, chain } = token

              return (
                <Styles.CurrencyBlock
                  key={`${symbol}/${chain}`}
                  onClick={onAddToken(symbol, chain, name)}
                >
                  <CurrencyLogo symbol={symbol} width={40} height={40} br={10} chain={chain} />
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

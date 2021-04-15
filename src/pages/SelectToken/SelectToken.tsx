import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Config
import tokens, { IToken, checkExistWallet } from '@config/tokens'

// Utils
import { toUpper, toLower } from '@utils/format'
import { getWallets } from '@utils/wallet'

// Styles
import Styles from './styles'

interface LocationState {
  currencyFrom: string
  chain: string
}

const SelectToken: React.FC = () => {
  const history = useHistory()
  const {
    state: { currencyFrom, chain },
  } = useLocation<LocationState>()

  const [searchValue, setSearchValue] = React.useState<string>('')

  const filterTokensList = tokens
    .filter((token: IToken) => toLower(token.chain) === toLower(chain))
    .filter((token: IToken) => {
      if (searchValue.length) {
        const findByName = toLower(token.name)?.indexOf(toLower(searchValue) || '') !== -1
        const findBySymbol = toLower(token.symbol)?.indexOf(toLower(searchValue) || '') !== -1

        return findByName || findBySymbol
      }
      return token
    })

  const onAddCustomToken = (): void => {
    history.push('/add-custom-token')
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

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle={`${currencyFrom} wallet`} />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Select token</Styles.Title>

          <TextInput
            value={searchValue}
            label="Type a currency or ticker"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setSearchValue(e.target.value)
            }
          />

          {!filterTokensList.length ? (
            <Styles.NotFoundMessage>
              Currency was not found but you can add custom token
            </Styles.NotFoundMessage>
          ) : null}

          <Styles.TokensList>
            {filterTokensList.map((token: IToken) => {
              const { name, symbol, chain } = token

              return (
                <Styles.TokenBlock key={symbol} onClick={() => onAddToken(symbol, chain)}>
                  <CurrencyLogo
                    symbol={symbol}
                    width={40}
                    height={40}
                    br={10}
                    chain={chain}
                    isToken
                  />
                  <Styles.TokenName>{name}</Styles.TokenName>
                  <Styles.TokenSymbol>{toUpper(symbol)}</Styles.TokenSymbol>
                </Styles.TokenBlock>
              )
            })}

            <Styles.TokenBlock onClick={onAddCustomToken}>
              <Styles.CustomTokenLogo>
                <SVG
                  src="../../assets/icons/plusCircle.svg"
                  width={20}
                  height={20}
                  title="Create new wallet"
                />
              </Styles.CustomTokenLogo>
              <Styles.CustomTokenLabel>Add Custom Token</Styles.CustomTokenLabel>
            </Styles.TokenBlock>
          </Styles.TokensList>
        </Styles.Row>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SelectToken

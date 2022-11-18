import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'
import NetworksList from '@components/NetworksList'

// Utils
import { toUpper, toLower } from '@utils/format'

// Types
import { TToken } from '@tokens/types'

// Assets
import plusCircleIcon from '@assets/icons/plusCircle.svg'

// Styles
import Styles from '../styles'

interface Props {
  onAddCustomToken: () => void
  onAddToken: (symbol: string, chain: string, tokenName: string) => () => void
  tokens: TToken[]
}

const TokensTab: React.FC<Props> = (props) => {
  const { onAddCustomToken, onAddToken, tokens } = props

  const [searchValue, setSearchValue] = React.useState<string>('')
  const [tokensList, setTokensList] = React.useState<TToken[]>([])
  const [activeNetwork, setActiveNetwork] = React.useState<string>('all')

  React.useEffect(() => {
    setTimeout(onGetTokens)
  }, [activeNetwork])

  const onGetTokens = (): void => {
    if (activeNetwork === 'all') {
      setTokensList(tokens)
    } else {
      const filterByChain = tokens.filter((item: TToken) => item.chain === activeNetwork)

      setTokensList(filterByChain)
    }
  }

  const filterTokensList = tokensList.filter((token: TToken) => {
    if (searchValue.length) {
      const findByName = toLower(token.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(token.symbol)?.indexOf(toLower(searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return token
  })

  return (
    <Styles.Tab>
      <TextInput
        value={searchValue}
        label="Type a currency or a ticker"
        onChange={setSearchValue}
        type="text"
      />

      <NetworksList activeKey={activeNetwork} setActiveKey={setActiveNetwork} />

      {!filterTokensList.length ? (
        <Styles.NotFoundMessage>
          The currency was not found but you can add a custom token
        </Styles.NotFoundMessage>
      ) : null}

      <Styles.TokensList>
        <Styles.CustomTokenBlock onClick={onAddCustomToken}>
          <Styles.CustomTokenLogo>
            <SVG src={plusCircleIcon} width={20} height={20} />
          </Styles.CustomTokenLogo>
          <Styles.CustomTokenLabel>Add Custom Token</Styles.CustomTokenLabel>
        </Styles.CustomTokenBlock>
        {filterTokensList.map((token: TToken, index) => {
          const { name, symbol, chain } = token

          return (
            <Styles.CurrencyBlock
              key={`${symbol}/${chain}/${index}`}
              onClick={onAddToken(symbol, chain, name)}
            >
              <CurrencyLogo symbol={symbol} size={40} br={10} chain={chain} />
              <Styles.CurrencyName>{name}</Styles.CurrencyName>
              <Styles.CurrencySymbol>{toUpper(symbol)}</Styles.CurrencySymbol>
            </Styles.CurrencyBlock>
          )
        })}
      </Styles.TokensList>
    </Styles.Tab>
  )
}

export default TokensTab

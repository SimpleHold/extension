// Utils
import { getItem, setItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Types
import { IToken } from '@config/tokens'

export const compare = (tokens: IToken[]): void => {
  const getTokens = getItem('tokens')

  if (getTokens?.length) {
    const parseTokens = JSON.parse(getTokens)

    if (parseTokens?.length) {
      const getNewTokens = tokens.filter((token: IToken) => {
        const findBySymbol = parseTokens.find(
          (item: IToken) => toLower(item.chain) === toLower(token.chain)
        )
        const findByAddress = parseTokens.find(
          (item: IToken) => toLower(item.address) === toLower(token.address)
        )

        return !findBySymbol || !findByAddress
      })

      if (getNewTokens.length) {
        setItem('tokens', JSON.stringify([...parseTokens, ...getNewTokens]))
      }
    }
  } else {
    setItem('tokens', JSON.stringify(tokens))
  }
}

export const getTokens = (): IToken[] => {
  try {
    const getTokens = getItem('tokens')

    if (getTokens?.length) {
      const parseTokens = JSON.parse(getTokens)

      if (parseTokens?.length) {
        return parseTokens
      }
    }

    return []
  } catch {
    return []
  }
}

export const getToken = (chain: string, symbol: string): IToken | undefined => {
  const tokens = getTokens()

  return tokens.find(
    (token: IToken) =>
      toLower(token.symbol) === toLower(symbol) && toLower(token.chain) === toLower(chain)
  )
}

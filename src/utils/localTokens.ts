// Utils
import { getItem, setItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Types
import { IToken } from '@config/tokens'

export const addNew = (tokens: IToken[]): void => {
  setItem('tokens', JSON.stringify(tokens))
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

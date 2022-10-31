// Utils
import { getItem, setItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Types
import { TToken } from '@tokens/types'

export const addNew = (tokens: TToken[]): void => {
  setItem('tokens', JSON.stringify(tokens))
}

export const getTokens = (): TToken[] => {
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

export const getToken = (chain: string, symbol: string): TToken | undefined => {
  const tokens = getTokens()

  return tokens.find(
    (token: TToken) =>
      toLower(token.symbol) === toLower(symbol) && toLower(token.chain) === toLower(chain)
  )
}

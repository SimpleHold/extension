// Utils
import { toLower } from '@utils/format'

// Currencies
import currencies from './index'

// Types
import { TCurrency } from './types'

export const getCurrencyInfo = (symbol: string): TCurrency | undefined => {
  return currencies.find((currency: TCurrency) => toLower(currency.symbol) === toLower(symbol))
}

export const getCurrencyByChain = (chain: string): TCurrency | undefined => {
  return currencies.find((currency: TCurrency) => toLower(currency.chain) === toLower(chain))
}

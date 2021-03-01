import bitcoinLogo from '../assets/currencies/btc.svg'

export interface ICurrency {
  name: string
  symbol: string
  logo: string
  background: string
}

const currencies: ICurrency[] = [
  {
    name: 'Bitcoin',
    symbol: 'btc',
    logo: bitcoinLogo,
    background: '#f7931a33',
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => currency.symbol === symbol)
}

export default currencies

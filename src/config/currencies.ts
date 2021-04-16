// Currencies logo
import bitcoinLogo from '@assets/currencies/btc.svg'
import bitcoinCashLogo from '@assets/currencies/bch.svg'
import bitcoinSVLogo from '@assets/currencies/bsv.svg'
import litecoinLogo from '@assets/currencies/ltc.svg'
import dogecoinLogo from '@assets/currencies/doge.svg'
import dashLogo from '@assets/currencies/dash.svg'

export interface ICurrency {
  name: string
  symbol: string
  logo: string
  background: string
  chain: string
  minSendAmount: number
}

const currencies: ICurrency[] = [
  {
    name: 'Bitcoin',
    symbol: 'btc',
    logo: bitcoinLogo,
    background: '#FDE9D1',
    chain: 'bitcoin',
    minSendAmount: 1000,
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'bch',
    logo: bitcoinCashLogo,
    background: '#DDF2E9',
    chain: 'bitcoin-cash',
    minSendAmount: 87000,
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv',
    logo: bitcoinSVLogo,
    background: '#FBF0CC',
    chain: 'bitcoin-sv',
    minSendAmount: 200000,
  },
  {
    name: 'Litecoin',
    symbol: 'ltc',
    logo: litecoinLogo,
    background: '#DFEEFB',
    chain: 'litecoin',
    minSendAmount: 245000,
  },
  {
    name: 'Dogecoin',
    symbol: 'doge',
    logo: dogecoinLogo,
    background: '#F3EDD6',
    chain: 'dogecoin',
    minSendAmount: 100000000,
  },
  {
    name: 'Dash',
    symbol: 'dash',
    logo: dashLogo,
    background: '#CCE8FA',
    chain: 'dash',
    minSendAmount: 200000,
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => currency.symbol === symbol)
}

export default currencies

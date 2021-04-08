// Currencies logo
import bitcoinLogo from '@assets/currencies/btc.svg'
import bitcoinCashLogo from '@assets/currencies/bch.svg'
import bitcoinSVLogo from '@assets/currencies/bsv.svg'
import litecoinLogo from '@assets/currencies/ltc.svg'
import dogecoinLogo from '@assets/currencies/doge.svg'
import dashLogo from '@assets/currencies/dash.svg'
import ethereumLogo from '@assets/currencies/eth.svg'
import ethereumClassicLogo from '@assets/currencies/etc.svg'
import binanceLogo from '@assets/currencies/bnb.svg'

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
    background: '#F7931A',
    chain: 'bitcoin',
    minSendAmount: 1000,
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'bch',
    logo: bitcoinCashLogo,
    background: '#57BD91',
    chain: 'bitcoin-cash',
    minSendAmount: 87000,
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv',
    logo: bitcoinSVLogo,
    background: '#EAB300',
    chain: 'bitcoin-sv',
    minSendAmount: 200000,
  },
  {
    name: 'Litecoin',
    symbol: 'ltc',
    logo: litecoinLogo,
    background: '#5EABE9',
    chain: 'litecoin',
    minSendAmount: 245000,
  },
  {
    name: 'Dogecoin',
    symbol: 'doge',
    logo: dogecoinLogo,
    background: '#C3A634',
    chain: 'dogecoin',
    minSendAmount: 100000000,
  },
  {
    name: 'Dash',
    symbol: 'dash',
    logo: dashLogo,
    background: '#008DE4',
    chain: 'dash',
    minSendAmount: 200000,
  },
  {
    name: 'Ethereum',
    symbol: 'eth',
    logo: ethereumLogo,
    background: '#132BD8',
    chain: 'ethereum',
    minSendAmount: 2400000000000000,
  },
  {
    name: 'Ethereum Classic',
    symbol: 'etc',
    logo: ethereumClassicLogo,
    background: '#49803D',
    chain: 'ethereum-classic',
    minSendAmount: 52850000000000000,
  },
  {
    name: 'Binance Coin',
    symbol: 'bnb',
    logo: binanceLogo,
    background: '#EBBB4E',
    chain: 'binance',
    minSendAmount: 14770000000000000,
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => currency.symbol === symbol)
}

export default currencies

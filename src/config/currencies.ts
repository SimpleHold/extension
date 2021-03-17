// Currencies logo
import bitcoinLogo from '@assets/currencies/btc.svg'
import bitcoinCashLogo from '@assets/currencies/bch.svg'
import bitcoinSVLogo from '@assets/currencies/bsv.svg'
import litecoinLogo from '@assets/currencies/ltc.svg'
import dogecoinLogo from '@assets/currencies/doge.svg'
import dashLogo from '@assets/currencies/dash.svg'
import zcashLogo from '@assets/currencies/zec.svg'
import groestlcoinLogo from '@assets/currencies/grs.svg'

export interface ICurrency {
  name: string
  symbol: string
  logo: string
  background: string
  chain: string
}

const currencies: ICurrency[] = [
  {
    name: 'Bitcoin',
    symbol: 'btc',
    logo: bitcoinLogo,
    background: '#FDE9D1',
    chain: 'bitcoin',
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'bch',
    logo: bitcoinCashLogo,
    background: '#DDF2E9',
    chain: 'bitcoin-cash',
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv',
    logo: bitcoinSVLogo,
    background: '#FBF0CC',
    chain: 'bitcoin-sv',
  },
  {
    name: 'Litecoin',
    symbol: 'ltc',
    logo: litecoinLogo,
    background: '#DFEEFB',
    chain: 'litecoin',
  },
  {
    name: 'Dogecoin',
    symbol: 'doge',
    logo: dogecoinLogo,
    background: '#F3EDD6',
    chain: 'dogecoin',
  },
  {
    name: 'Dash',
    symbol: 'dash',
    logo: dashLogo,
    background: '#CCE8FA',
    chain: 'dash',
  },
  {
    name: 'Zcash',
    symbol: 'zec',
    logo: zcashLogo,
    background: '#FDF1D4',
    chain: 'zcash',
  },
  {
    name: 'Groestlcoin',
    symbol: 'grs',
    logo: groestlcoinLogo,
    background: '#D5E7F9',
    chain: 'groestlcoin',
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => currency.symbol === symbol)
}

export default currencies

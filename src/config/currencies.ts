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
import thetaLogo from '@assets/currencies/theta.svg'
import tfuelLogo from '@assets/currencies/theta.svg'
import cardanoLogo from '@assets/currencies/ada.svg'
import rippleLogo from '@assets/currencies/xrp.svg'
import neblioLogo from '@assets/currencies/nebl.svg'

// Utils
import { toLower } from '@utils/format'

export interface ICurrency {
  name: string
  symbol: string
  logo: string
  background: string
  chain: string
  minSendAmount: number
  isCustomFee: boolean
}

const currencies: ICurrency[] = [
  {
    name: 'Bitcoin',
    symbol: 'btc',
    logo: bitcoinLogo,
    background: '#F7931A',
    chain: 'bitcoin',
    minSendAmount: 1000,
    isCustomFee: true,
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'bch',
    logo: bitcoinCashLogo,
    background: '#57BD91',
    chain: 'bitcoin-cash',
    minSendAmount: 87000,
    isCustomFee: true,
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv',
    logo: bitcoinSVLogo,
    background: '#EAB300',
    chain: 'bitcoin-sv',
    minSendAmount: 200000,
    isCustomFee: true,
  },
  {
    name: 'Litecoin',
    symbol: 'ltc',
    logo: litecoinLogo,
    background: '#5EABE9',
    chain: 'litecoin',
    minSendAmount: 245000,
    isCustomFee: true,
  },
  {
    name: 'Dogecoin',
    symbol: 'doge',
    logo: dogecoinLogo,
    background: '#C3A634',
    chain: 'dogecoin',
    minSendAmount: 100000000,
    isCustomFee: true,
  },
  {
    name: 'Dash',
    symbol: 'dash',
    logo: dashLogo,
    background: '#008DE4',
    chain: 'dash',
    minSendAmount: 100000,
    isCustomFee: true,
  },
  {
    name: 'Ethereum',
    symbol: 'eth',
    logo: ethereumLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 1000000000000000,
    isCustomFee: true,
  },
  {
    name: 'Ethereum Classic',
    symbol: 'etc',
    logo: ethereumClassicLogo,
    background: '#49803D',
    chain: 'etc',
    minSendAmount: 1000000000000000,
    isCustomFee: true,
  },
  {
    name: 'Binance Smart Chain',
    symbol: 'bnb',
    logo: binanceLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 1000000000000000,
    isCustomFee: true,
  },
  {
    name: 'Theta',
    symbol: 'theta',
    logo: thetaLogo,
    background: '#76CCD3',
    chain: 'theta',
    minSendAmount: 1000000000000000,
    isCustomFee: false,
  },
  {
    name: 'Theta Fuel',
    symbol: 'tfuel',
    logo: tfuelLogo,
    background: '#EF8053',
    chain: 'tfuel',
    minSendAmount: 1000000000000000,
    isCustomFee: false,
  },
  {
    name: 'Cardano Shelley',
    symbol: 'ada',
    logo: cardanoLogo,
    background: '#2B55BB',
    chain: 'cardano',
    minSendAmount: 1000000,
    isCustomFee: false,
  },
  {
    name: 'XRP',
    symbol: 'xrp',
    logo: rippleLogo,
    background: '#5088BC',
    chain: 'ripple',
    minSendAmount: 1000,
    isCustomFee: false,
  },
  {
    name: 'Neblio',
    symbol: 'nebl',
    logo: neblioLogo,
    background: '#9172CE',
    chain: 'neblio',
    minSendAmount: 100000,
    isCustomFee: false,
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => toLower(currency.symbol) === toLower(symbol))
}

export const getCurrencyByChain = (chain: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => toLower(currency.chain) === toLower(chain))
}

export const checkWithPhrase = (symbol: string): boolean => {
  const list: string[] = ['ada']

  return list.indexOf(symbol) !== -1
}

export default currencies

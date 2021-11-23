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
import nulsLogo from '@assets/currencies/nuls.svg'
import maticLogo from '@assets/currencies/matic.svg'
import nerveLogo from '@assets/currencies/nvt.svg'
import tronLogo from '@assets/currencies/trx.svg'
import zilLogo from '@assets/currencies/zil.svg'
import hbarLogo from '@assets/currencies/hbar.svg'
import xvgLogo from '@assets/currencies/xvg.svg'
import xdcLogo from '@assets/currencies/xdc.svg'
import solLogo from '@assets/currencies/sol.svg'
import oneLogo from '@assets/currencies/one.svg'
import vetLogo from '@assets/currencies/vet.svg'
import vthoLogo from '@assets/currencies/vtho.svg'
import toncoinLogo from '@assets/currencies/toncoin.svg'

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
    isCustomFee: false,
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
    isCustomFee: false,
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
  {
    name: 'Nuls',
    symbol: 'nuls',
    logo: nulsLogo,
    background: '#69E291',
    chain: 'nuls',
    minSendAmount: 100000,
    isCustomFee: false,
  },
  {
    name: 'Polygon',
    symbol: 'matic',
    logo: maticLogo,
    background: '#9767E9',
    chain: 'matic',
    minSendAmount: 1000000000000000,
    isCustomFee: false,
  },
  {
    name: 'Nerve',
    symbol: 'nvt',
    logo: nerveLogo,
    background: '#729EEB',
    chain: 'nvt',
    minSendAmount: 100000,
    isCustomFee: false,
  },
  {
    name: 'Tron',
    symbol: 'trx',
    logo: tronLogo,
    background: '#D0564E',
    chain: 'tron',
    minSendAmount: 1000000,
    isCustomFee: false,
  },
  {
    name: 'Zilliqa',
    symbol: 'zil',
    logo: zilLogo,
    background: '#59D0C9',
    chain: 'zilliqa',
    minSendAmount: 1000000,
    isCustomFee: false,
  },
  {
    name: 'Hedera Hashgraph',
    symbol: 'hbar',
    logo: hbarLogo,
    background: '#343439',
    chain: 'hedera',
    minSendAmount: 1000,
    isCustomFee: false,
  },
  {
    name: 'Verge',
    symbol: 'xvg',
    logo: xvgLogo,
    background: '#6FBDDB',
    chain: 'verge',
    minSendAmount: 100000,
    isCustomFee: false,
  },
  {
    name: 'XinFin',
    symbol: 'xdc',
    logo: xdcLogo,
    background: '#4A769A',
    chain: 'xinfin',
    minSendAmount: 1000000000000000,
    isCustomFee: false,
  },
  {
    name: 'Solana',
    symbol: 'sol',
    logo: solLogo,
    background: '#2CD9A0',
    chain: 'solana',
    minSendAmount: 1000,
    isCustomFee: false,
  },
  {
    name: 'Harmony',
    symbol: 'one',
    logo: oneLogo,
    background: '#50B2E1',
    chain: 'harmony',
    minSendAmount: 1000000000000000,
    isCustomFee: false,
  },
  {
    name: 'VeChain',
    symbol: 'vet',
    logo: vetLogo,
    background: '#86A7FD',
    chain: 'vechain',
    minSendAmount: 100000000000000,
    isCustomFee: false,
  },
  {
    name: 'VeThor Token',
    symbol: 'vtho',
    logo: vthoLogo,
    background: '#A5BADA',
    chain: 'vethor',
    minSendAmount: 100000000000000,
    isCustomFee: false,
  },
  {
    name: 'Toncoin',
    symbol: 'toncoin',
    logo: toncoinLogo,
    background: '#2D9DD5',
    chain: 'toncoin',
    minSendAmount: 1000,
    isCustomFee: false,
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => toLower(currency.symbol) === toLower(symbol))
}

export const getCurrencyByChain = (chain: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => toLower(currency.chain) === toLower(chain))
}

export default currencies

import ethLogo from '@assets/currencies/eth.svg'
import etcLogo from '@assets/currencies/etc.svg'
import bnbLogo from '@assets/currencies/bnb.svg'
import maticLogo from '@assets/currencies/matic.svg'
import ftmLogo from '@assets/currencies/ftm.svg'
import avaxLogo from '@assets/currencies/avax.svg'
import movrLogo from '@assets/currencies/movr.svg'
import aethLogo from '@assets/currencies/aeth.svg'
import reiLogo from '@assets/currencies/rei.svg'
import ewtLogo from '@assets/currencies/ewt.svg'
import gnoLogo from '@assets/currencies/gno.svg'
import oktLogo from '@assets/currencies/okt.svg'
import celoLogo from '@assets/currencies/celo.svg'

// Config
import { CURRENCIES_COLOR } from '@config/colors'

// Types
import { TCurrency } from './types'

const ETHEREUM_LIKE_CURRENCIES: TCurrency[] = [
  {
    symbol: 'eth',
    name: 'Ethereum',
    chain: 'eth',
    background: CURRENCIES_COLOR.ETH,
    logo: ethLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'etc',
    name: 'Ethereum Classic',
    chain: 'etc',
    background: CURRENCIES_COLOR.ETC,
    logo: etcLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'bnb',
    name: 'Binance Smart Chain',
    chain: 'bsc',
    background: CURRENCIES_COLOR.BNB,
    logo: bnbLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'matic',
    name: 'Polygon',
    chain: 'matic',
    background: CURRENCIES_COLOR.MATIC,
    logo: maticLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'ftm',
    name: 'Fantom',
    chain: 'ftm',
    background: CURRENCIES_COLOR.FTM,
    logo: ftmLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'avax',
    name: 'Avalanche C-Chain',
    chain: 'avax',
    background: CURRENCIES_COLOR.AVAX,
    logo: avaxLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'oeth',
    name: 'Optimistic Ethereum',
    chain: 'oeth',
    background: CURRENCIES_COLOR.OETH,
    logo: ethLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'movr',
    name: 'Moonriver',
    chain: 'movr',
    background: CURRENCIES_COLOR.MOVR,
    logo: movrLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'aeth',
    name: 'Arbitrum One',
    chain: 'arbitrum',
    background: CURRENCIES_COLOR.AETH,
    logo: aethLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'rei',
    name: 'REI Network',
    chain: 'rei',
    background: CURRENCIES_COLOR.REI,
    logo: reiLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'ewt',
    name: 'Energy Web Token',
    chain: 'energy-web',
    background: CURRENCIES_COLOR.EWT,
    logo: ewtLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'xdai',
    name: 'Gnosis',
    chain: 'gnosis',
    background: CURRENCIES_COLOR.GNO,
    logo: gnoLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'okt',
    name: 'OKXChain Mainnet',
    chain: 'okx',
    background: CURRENCIES_COLOR.OKT,
    logo: oktLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'celo',
    name: 'Celo',
    chain: 'celo',
    background: CURRENCIES_COLOR.CELO,
    logo: celoLogo,
    minSendAmount: '1000000000000000',
  },
]

export default ETHEREUM_LIKE_CURRENCIES

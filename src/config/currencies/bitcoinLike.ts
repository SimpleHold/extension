import btcLogo from '@assets/currencies/btc.svg'
import ltcLogo from '@assets/currencies/ltc.svg'
import dashLogo from '@assets/currencies/dash.svg'
import dogeLogo from '@assets/currencies/doge.svg'
import bchLogo from '@assets/currencies/bch.svg'
import bsvLogo from '@assets/currencies/bsv.svg'

// Config
import { CURRENCIES_COLOR } from '@config/colors'

// Types
import { TCurrency } from './types'

const BITCOIN_LIKE_CURRENCIES: TCurrency[] = [
  {
    symbol: 'btc',
    name: 'Bitcoin',
    chain: 'bitcoin',
    background: CURRENCIES_COLOR.BTC,
    logo: btcLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'ltc',
    name: 'Litecoin',
    chain: 'litecoin',
    background: CURRENCIES_COLOR.LTC,
    logo: ltcLogo,
    minSendAmount: '10000',
  },
  {
    symbol: 'dash',
    name: 'Dash',
    chain: 'dash',
    background: CURRENCIES_COLOR.DASH,
    logo: dashLogo,
    minSendAmount: '10000',
  },
  {
    symbol: 'doge',
    name: 'Dogecoin',
    chain: 'dogecoin',
    background: CURRENCIES_COLOR.DOGE,
    logo: dogeLogo,
    minSendAmount: '100000000',
  },
  {
    symbol: 'bch',
    name: 'Bitcoin Cash',
    chain: 'bitcoin-cash',
    background: CURRENCIES_COLOR.BCH,
    logo: bchLogo,
    minSendAmount: '10000',
  },
  {
    symbol: 'bsv',
    name: 'Bitcoin SV',
    chain: 'bitcoin-sv',
    background: CURRENCIES_COLOR.BSV,
    logo: bsvLogo,
    minSendAmount: '10000',
  },
]

export default BITCOIN_LIKE_CURRENCIES

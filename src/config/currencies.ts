// Networks
import bitcore from 'bitcore-lib'
import litecore from 'litecore-lib'
import dogecore from 'bitcore-lib-doge'
import bitcoreCash from 'bitcore-lib-cash'

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
  provider: any // Fix me
  chain: string
}

bitcore.Networks.add({
  name: 'bitcoinsv',
  alias: 'bsv',
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  dnsSeeds: ['seed.bitcoinsv.io', 'btccash-seeder.bitcoinunlimited.info'],
})

const currencies: ICurrency[] = [
  {
    name: 'Bitcoin',
    symbol: 'btc',
    logo: bitcoinLogo,
    background: '#FDE9D1',
    provider: bitcore,
    chain: 'bitcoin',
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'bch',
    logo: bitcoinCashLogo,
    background: '#DDF2E9',
    provider: bitcoreCash,
    chain: 'bitcoin-cash',
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv',
    logo: bitcoinSVLogo,
    background: '#FBF0CC',
    provider: bitcore,
    chain: 'bitcoin-sv',
  },
  {
    name: 'Litecoin',
    symbol: 'ltc',
    logo: litecoinLogo,
    background: '#DFEEFB',
    provider: litecore,
    chain: 'litecoin',
  },
  {
    name: 'Dogecoin',
    symbol: 'doge',
    logo: dogecoinLogo,
    background: '#F3EDD6',
    provider: dogecore,
    chain: 'dogecoin',
  },
  {
    name: 'Dash',
    symbol: 'dash',
    logo: dashLogo,
    background: '#CCE8FA',
    provider: window.dashcore,
    chain: 'dash',
  },
  {
    name: 'Zcash',
    symbol: 'zec',
    logo: bitcoinLogo,
    background: '#FDF1D4',
    provider: zcashLogo,
    chain: 'zcash',
  },
  {
    name: 'Groestlcoin',
    symbol: 'grs',
    logo: groestlcoinLogo,
    background: '#D5E7F9',
    provider: bitcore,
    chain: 'groestlcoin',
  },
]

export const getCurrency = (symbol: string): ICurrency | undefined => {
  return currencies.find((currency: ICurrency) => currency.symbol === symbol)
}

export default currencies

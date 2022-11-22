import dotLogo from '@assets/currencies/dot.svg'
import ksmLogo from '@assets/currencies/ksm.svg'
import sdnLogo from '@assets/currencies/sdn.svg'
import reefLogo from '@assets/currencies/reef.svg'
import acaLogo from '@assets/currencies/aca.svg'

// Config
import { CURRENCIES_COLOR } from '@config/colors'

// Types
import { TCurrency } from './types'

const POLKADOT_LIKE_CURRENCIES: TCurrency[] = [
  {
    symbol: 'dot',
    name: 'Polkadot',
    chain: 'polkadot',
    background: CURRENCIES_COLOR.DOT,
    logo: dotLogo,
    minSendAmount: '10000000',
  },
  {
    symbol: 'ksm',
    name: 'Kusama',
    chain: 'kusama',
    background: CURRENCIES_COLOR.KSM,
    logo: ksmLogo,
    minSendAmount: '1000000000',
  },
  {
    symbol: 'sdn',
    name: 'Shiden',
    chain: 'shiden',
    background: CURRENCIES_COLOR.SDN,
    logo: sdnLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'reef',
    name: 'Reef',
    chain: 'reef',
    background: CURRENCIES_COLOR.REEF,
    logo: reefLogo,
    minSendAmount: '10000000',
  },
  {
    symbol: 'aca',
    name: 'Acala Token',
    chain: 'acala',
    background: CURRENCIES_COLOR.ACA,
    logo: acaLogo,
    minSendAmount: '1000000000',
  },
]

export default POLKADOT_LIKE_CURRENCIES

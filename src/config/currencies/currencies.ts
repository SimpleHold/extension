import trxLogo from '@assets/currencies/trx.svg'
import thetaLogo from '@assets/currencies/theta.svg'
import tfuelLogo from '@assets/currencies/theta.svg'
import nulsLogo from '@assets/currencies/nuls.svg'
import nvtLogo from '@assets/currencies/nvt.svg'
import neblLogo from '@assets/currencies/nebl.svg'
import adaLogo from '@assets/currencies/ada.svg'
import xrpLogo from '@assets/currencies/xrp.svg'
import xvgLogo from '@assets/currencies/xvg.svg'
import xdcLogo from '@assets/currencies/xdc.svg'
import solLogo from '@assets/currencies/sol.svg'
import oneLogo from '@assets/currencies/one.svg'
import zilLogo from '@assets/currencies/zil.svg'
import toncoinLogo from '@assets/currencies/toncoin.svg'
import iotxLogo from '@assets/currencies/iotx.svg'
import lunaLogo from '@assets/currencies/luna.svg'
import luncLogo from '@assets/currencies/lunc.svg'
import xlmLogo from '@assets/currencies/xlm.svg'
import neoLogo from '@assets/currencies/neo.svg'
import xtzLogo from '@assets/currencies/xtz.svg'
import fioLogo from '@assets/currencies/fio.svg'
import wavesLogo from '@assets/currencies/waves.svg'
import qtumLogo from '@assets/currencies/qtum.svg'
import nearLogo from '@assets/currencies/near.svg'
import icxLogo from '@assets/currencies/icx.svg'
import sxpLogo from '@assets/currencies/sxp.svg'
import miotaLogo from '@assets/currencies/miota.svg'
import egldLogo from '@assets/currencies/egld.svg'
import csprLogo from '@assets/currencies/cspr.svg'
import aptLogo from '@assets/currencies/apt.svg'
import hbarLogo from '@assets/currencies/hbar.svg'
import vetLogo from '@assets/currencies/vet.svg'
import vthoLogo from '@assets/currencies/vtho.svg'
import ravencoinLogo from '@assets/currencies/rvn.svg'
import digibyteLogo from '@assets/currencies/dgb.svg'
import xnoLogo from '@assets/currencies/xno.svg'

import { CURRENCIES_COLOR } from '@config/colors'

// Types
import { TCurrency } from './types'

const ALL_CURRENCIES: TCurrency[] = [
  {
    symbol: 'trx',
    name: 'Tron',
    chain: 'tron',
    background: CURRENCIES_COLOR.TRX,
    logo: trxLogo,
    minSendAmount: '1000000',
  },
  {
    symbol: 'theta',
    name: 'Theta',
    chain: 'theta',
    background: CURRENCIES_COLOR.THETA,
    logo: thetaLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'tfuel',
    name: 'Tfuel',
    chain: 'tfuel',
    background: CURRENCIES_COLOR.TFUEL,
    logo: tfuelLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'nuls',
    name: 'Nuls',
    chain: 'nuls',
    background: CURRENCIES_COLOR.NULS,
    logo: nulsLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'nvt',
    name: 'Nerve',
    chain: 'nvt',
    background: CURRENCIES_COLOR.NERVE,
    logo: nvtLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'nebl',
    name: 'Neblio',
    chain: 'neblio',
    background: CURRENCIES_COLOR.NEBL,
    logo: neblLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'ada',
    name: 'Cardano Shelley',
    chain: 'cardano',
    background: CURRENCIES_COLOR.ADA,
    logo: adaLogo,
    minSendAmount: '1000000',
  },
  {
    symbol: 'xrp',
    name: 'XRP',
    chain: 'ripple',
    background: CURRENCIES_COLOR.XRP,
    logo: xrpLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xvg',
    name: 'Verge',
    chain: 'verge',
    background: CURRENCIES_COLOR.XVG,
    logo: xvgLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xdc',
    name: 'XinFin',
    chain: 'xinfin',
    background: CURRENCIES_COLOR.XDC,
    logo: xdcLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'sol',
    name: 'Solana',
    chain: 'solana',
    background: CURRENCIES_COLOR.SOL,
    logo: solLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'one',
    name: 'Harmony',
    chain: 'harmony',
    background: CURRENCIES_COLOR.ONE,
    logo: oneLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'zil',
    name: 'Zilliqa',
    chain: 'zilliqa',
    background: CURRENCIES_COLOR.ZIL,
    logo: zilLogo,
    minSendAmount: '1000000',
  },
  {
    symbol: 'toncoin',
    name: 'Toncoin',
    chain: 'toncoin',
    background: CURRENCIES_COLOR.TONCOIN,
    logo: toncoinLogo,
    minSendAmount: '1000',
  },
  // {
  //   symbol: 'iotx',
  //   name: 'IoTeX',
  //   chain: 'iotex',
  //   background: CURRENCIES_COLOR.IOTX,
  //   logo: iotxLogo,
  //   minSendAmount: '1000000000000000',
  // },
  {
    symbol: 'luna',
    name: 'Terra',
    chain: 'terra',
    background: CURRENCIES_COLOR.LUNA,
    logo: lunaLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'lunc',
    name: 'Terra Classic',
    chain: 'terra-classic',
    background: CURRENCIES_COLOR.LUNC,
    logo: luncLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xlm',
    name: 'Stellar',
    chain: 'stellar',
    background: CURRENCIES_COLOR.XLM,
    logo: xlmLogo,
    minSendAmount: '10000',
  },
  {
    symbol: 'neo',
    name: 'NEO',
    chain: 'neo',
    background: CURRENCIES_COLOR.NEO,
    logo: neoLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xtz',
    name: 'Tezos',
    chain: 'tezos',
    background: CURRENCIES_COLOR.XTZ,
    logo: xtzLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'fio',
    name: 'FIO Protocol',
    chain: 'fio-protocol',
    background: CURRENCIES_COLOR.FIO,
    logo: fioLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'waves',
    name: 'Waves',
    chain: 'waves',
    background: CURRENCIES_COLOR.WAVES,
    logo: wavesLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'qtum',
    name: 'Qtum',
    chain: 'qtum',
    background: CURRENCIES_COLOR.QTUM,
    logo: qtumLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'near',
    name: 'NEAR Protocol',
    chain: 'near',
    background: CURRENCIES_COLOR.NEAR,
    logo: nearLogo,
    minSendAmount: '1000000000000000000000',
  },
  {
    symbol: 'icx',
    name: 'Icon',
    chain: 'icon',
    background: CURRENCIES_COLOR.ICX,
    logo: icxLogo,
    minSendAmount: '1000000000000000',
  },
  // {
  //   symbol: 'sxp',
  //   name: 'SXP',
  //   chain: 'sxp',
  //   background: CURRENCIES_COLOR.SXP,
  //   logo: sxpLogo,
  //   minSendAmount: '100000',
  // },
  {
    symbol: 'miota',
    name: 'IOTA',
    chain: 'iota',
    background: CURRENCIES_COLOR.MIOTA,
    logo: miotaLogo,
    minSendAmount: '1000000',
  },
  {
    symbol: 'egld',
    name: 'Elrond',
    chain: 'elrond',
    background: CURRENCIES_COLOR.EGLD,
    logo: egldLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'cspr',
    name: 'Casper',
    chain: 'casper',
    background: CURRENCIES_COLOR.CSPR,
    logo: csprLogo,
    minSendAmount: '2500000000',
  },
  {
    symbol: 'apt',
    name: 'Aptos',
    chain: 'aptos',
    background: CURRENCIES_COLOR.APT,
    logo: aptLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'hbar',
    name: 'Hedera Hashgraph',
    chain: 'hedera',
    background: CURRENCIES_COLOR.HBAR,
    logo: hbarLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'vet',
    name: 'VeChain',
    chain: 'vechain',
    background: CURRENCIES_COLOR.VET,
    logo: vetLogo,
    minSendAmount: '100000000000000',
  },
  {
    symbol: 'vtho',
    name: 'VeThor Token',
    chain: 'vethor',
    background: CURRENCIES_COLOR.VTHO,
    logo: vthoLogo,
    minSendAmount: '100000000000000',
  },
  {
    symbol: 'rvn',
    name: 'Ravencoin',
    chain: 'ravencoin',
    background: CURRENCIES_COLOR.RVN,
    logo: ravencoinLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'dgb',
    name: 'DigiByte',
    chain: 'digibyte',
    background: CURRENCIES_COLOR.DGB,
    logo: digibyteLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'xno',
    name: 'Nano',
    chain: 'xno',
    background: CURRENCIES_COLOR.XNO,
    logo: xnoLogo,
    minSendAmount: '1000000000000000',
  },
]

export default ALL_CURRENCIES

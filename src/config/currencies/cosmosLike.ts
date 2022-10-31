import atomLogo from '@assets/currencies/atom.svg'
import aktLogo from '@assets/currencies/akt.svg'
import mntlLogo from '@assets/currencies/mntl.svg'
import bandLogo from '@assets/currencies/band.svg'
import bcnaLogo from '@assets/currencies/bcna.svg'
import btsgLogo from '@assets/currencies/btsg.svg'
import crbrusLogo from '@assets/currencies/crbrus.svg'
import huahuaLogo from '@assets/currencies/huahua.svg'
import cmdxLogo from '@assets/currencies/cmdx.svg'
import croLogo from '@assets/currencies/cro.svg'
import dsmLogo from '@assets/currencies/dsm.svg'
import ngmLogo from '@assets/currencies/ngm.svg'
import evmosLogo from '@assets/currencies/evmos.svg'
import fetLogo from '@assets/currencies/fet.svg'
import gravitonLogo from '@assets/currencies/graviton.svg'
import irisLogo from '@assets/currencies/iris.svg'
import junoLogo from '@assets/currencies/juno.svg'
import kavaLogo from '@assets/currencies/kava.svg'
import xkiLogo from '@assets/currencies/xki.svg'
import darcLogo from '@assets/currencies/darc.svg'
import lumLogo from '@assets/currencies/lum.svg'
import medLogo from '@assets/currencies/med.svg'
import osmoLogo from '@assets/currencies/osmo.svg'
import xprtLogo from '@assets/currencies/xprt.svg'
import regenLogo from '@assets/currencies/regen.svg'
import dvpnLogo from '@assets/currencies/dvpn.svg'
import rowanLogo from '@assets/currencies/rowan.svg'
import starsLogo from '@assets/currencies/stars.svg'
import iovLogo from '@assets/currencies/iov.svg'
import tgdLogo from '@assets/currencies/tgd.svg'
import umeeLogo from '@assets/currencies/umee.svg'

// Config
import { CURRENCIES_COLOR } from '@config/colors'

// Types
import { TCurrency } from './types'

const COSMOS_LIKE_CURRENCIES: TCurrency[] = [
  {
    symbol: 'atom',
    name: 'Cosmos',
    chain: 'cosmos',
    background: CURRENCIES_COLOR.ATOM,
    logo: atomLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'akt',
    name: 'Akash',
    chain: 'akash',
    background: CURRENCIES_COLOR.AKT,
    logo: aktLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'mntl',
    name: 'AssetMantle',
    chain: 'asset-mantle',
    background: CURRENCIES_COLOR.MNTL,
    logo: mntlLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'band',
    name: 'Band',
    chain: 'band',
    background: CURRENCIES_COLOR.BAND,
    logo: bandLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'bcna',
    name: 'Bitcanna',
    chain: 'bitcanna',
    background: CURRENCIES_COLOR.BCNA,
    logo: bcnaLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'btsg',
    name: 'Bitsong',
    chain: 'bitsong',
    background: CURRENCIES_COLOR.BTSG,
    logo: btsgLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'crbrus',
    name: 'Cerberus',
    chain: 'cerberus',
    background: CURRENCIES_COLOR.CRBRUS,
    logo: crbrusLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'huahua',
    name: 'Chihuahua',
    chain: 'chihuahua',
    background: CURRENCIES_COLOR.HUAHUA,
    logo: huahuaLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'cmdx',
    name: 'Comdex',
    chain: 'comdex',
    background: CURRENCIES_COLOR.AKT,
    logo: cmdxLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'cro',
    name: 'Crypto.org',
    chain: 'crypto-org',
    background: CURRENCIES_COLOR.CRO,
    logo: croLogo,
    minSendAmount: '100000',
  },
  {
    symbol: 'dsm',
    name: 'Desmos',
    chain: 'desmos',
    background: CURRENCIES_COLOR.DSM,
    logo: dsmLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'ngm',
    name: 'Emoney',
    chain: 'emoney',
    background: CURRENCIES_COLOR.NGM,
    logo: ngmLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'evmos',
    name: 'Evmos',
    chain: 'evmos',
    background: CURRENCIES_COLOR.EVMOS,
    logo: evmosLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'fet',
    name: 'Fetch.ai',
    chain: 'fetchai',
    background: CURRENCIES_COLOR.FET,
    logo: fetLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'graviton',
    name: 'Gravity Bridge',
    chain: 'gravity-bridge',
    background: CURRENCIES_COLOR.GRAVITON,
    logo: gravitonLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'iris',
    name: 'Iris',
    chain: 'iris',
    background: CURRENCIES_COLOR.IRIS,
    logo: irisLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'juno',
    name: 'Juno',
    chain: 'juno',
    background: CURRENCIES_COLOR.JUNO,
    logo: junoLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'kava',
    name: 'Kava',
    chain: 'kava',
    background: CURRENCIES_COLOR.KAVA,
    logo: kavaLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xki',
    name: 'KI',
    chain: 'ki-chain',
    background: CURRENCIES_COLOR.XKI,
    logo: xkiLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'darc',
    name: 'Konstellation',
    chain: 'konstellation',
    background: CURRENCIES_COLOR.DARC,
    logo: darcLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'lum',
    name: 'Lum',
    chain: 'lum',
    background: CURRENCIES_COLOR.LUM,
    logo: lumLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'med',
    name: 'Medibloc',
    chain: 'medibloc',
    background: CURRENCIES_COLOR.MED,
    logo: medLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'osmo',
    name: 'Osmosis',
    chain: 'osmosis',
    background: CURRENCIES_COLOR.OSMO,
    logo: osmoLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'xprt',
    name: 'Persistence',
    chain: 'persistence',
    background: CURRENCIES_COLOR.XPRT,
    logo: xprtLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'regen',
    name: 'Regen',
    chain: 'regen',
    background: CURRENCIES_COLOR.REGEN,
    logo: regenLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'dvpn',
    name: 'Sentinel',
    chain: 'sentinel',
    background: CURRENCIES_COLOR.DVPN,
    logo: dvpnLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'rowan',
    name: 'Sif',
    chain: 'sifchain',
    background: CURRENCIES_COLOR.ROWAN,
    logo: rowanLogo,
    minSendAmount: '1000000000000000',
  },
  {
    symbol: 'stars',
    name: 'Stargaze',
    chain: 'stargaze',
    background: CURRENCIES_COLOR.STARS,
    logo: starsLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'iov',
    name: 'Starname',
    chain: 'starname',
    background: CURRENCIES_COLOR.IOV,
    logo: iovLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'tgd',
    name: 'Tgrade',
    chain: 'tgrade',
    background: CURRENCIES_COLOR.TGD,
    logo: tgdLogo,
    minSendAmount: '1000',
  },
  {
    symbol: 'umee',
    name: 'Umee',
    chain: 'umee',
    background: CURRENCIES_COLOR.UMEE,
    logo: umeeLogo,
    minSendAmount: '1000',
  },
]

export default COSMOS_LIKE_CURRENCIES

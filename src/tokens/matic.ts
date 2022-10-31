import usdtLogo from '@assets/tokens/usdt.svg'
import usdcLogo from '@assets/tokens/usdc.svg'
import bnbLogo from '@assets/tokens/bnb.svg'
import wethLogo from '@assets/tokens/weth.svg'
import croLogo from '@assets/tokens/cro.svg'
import wbtcLogo from '@assets/tokens/wbtc.svg'
import flameLogo from '@assets/tokens/flame.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const ETH_TOKENS: TToken[] = [
  {
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    name: 'Wrapped Ether',
    symbol: 'weth',
    decimals: 18,
    logo: wethLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3',
    name: 'BNB (PoS)',
    symbol: 'bnb',
    decimals: 18,
    logo: bnbLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    name: '(PoS) Tether USD',
    symbol: 'usdt',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    name: 'USD Coin (PoS)',
    symbol: 'usdc',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xada58df0f643d959c2a47c9d4d4c1a4defe3f11c',
    name: 'CRO (PoS)',
    symbol: 'cro',
    decimals: 8,
    logo: croLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    name: '(PoS) Wrapped BTC',
    symbol: 'wbtc',
    decimals: 8,
    logo: wbtcLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x22e3f02f86bc8ea0d73718a2ae8851854e62adc5',
    name: 'FireStarter',
    symbol: 'flame',
    decimals: 18,
    logo: flameLogo,
    background: CHAINS.MATIC.background,
    chain: CHAINS.MATIC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default ETH_TOKENS

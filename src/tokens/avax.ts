import usdtLogo from '@assets/tokens/usdt.svg'
import usdcLogo from '@assets/tokens/usdc.svg'
import busdLogo from '@assets/tokens/busd.svg'
import shibLogo from '@assets/tokens/shib.svg'
import aaveLogo from '@assets/tokens/aave.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const AVAX_TOKENS: TToken[] = [
  {
    address: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    name: 'Tether USD',
    symbol: 'USDT.e',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.AVAX.background,
    chain: CHAINS.AVAX.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    name: 'USD Coin',
    symbol: 'USDC.e',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.AVAX.background,
    chain: CHAINS.AVAX.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98',
    name: 'Binance USD',
    symbol: 'BUSD.e',
    decimals: 18,
    logo: busdLogo,
    background: CHAINS.AVAX.background,
    chain: CHAINS.AVAX.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x02d980a0d7af3fb7cf7df8cb35d9edbcf355f665',
    name: 'SHIBA INU',
    symbol: 'SHIB.e',
    decimals: 18,
    logo: shibLogo,
    background: CHAINS.AVAX.background,
    chain: CHAINS.AVAX.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x63a72806098bd3d9520cc43356dd78afe5d386d9',
    name: 'Aave Token',
    symbol: 'AAVE.e',
    decimals: 18,
    logo: aaveLogo,
    background: CHAINS.AVAX.background,
    chain: CHAINS.AVAX.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default AVAX_TOKENS

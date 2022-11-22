import usdtLogo from '@assets/tokens/usdt.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const ARBITRUM_TOKENS: TToken[] = [
  {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.ARBITRUM.background,
    chain: CHAINS.ARBITRUM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default ARBITRUM_TOKENS

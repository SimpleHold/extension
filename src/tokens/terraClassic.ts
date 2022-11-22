import terraUstcLogo from '@assets/tokens/terraUstc.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const TRON_CLASSIC_TOKENS: TToken[] = [
  {
    address: '',
    name: 'TerraClassicUSD',
    symbol: 'ustc',
    decimals: 18,
    logo: terraUstcLogo,
    background: CHAINS.TERRA_CLASSIC.background,
    chain: CHAINS.TERRA_CLASSIC.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default TRON_CLASSIC_TOKENS

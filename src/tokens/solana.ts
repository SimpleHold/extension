import kinLogo from '@assets/tokens/kin.svg'
import usdcLogo from '@assets/tokens/usdc.svg'
import usdtLogo from '@assets/tokens/usdt.svg'
import gariLogo from '@assets/tokens/gari.svg'
import gstLogo from '@assets/tokens/gst.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const SOLANA_TOKENS: TToken[] = [
  {
    address: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
    name: 'KIN',
    symbol: 'kin',
    decimals: 5,
    logo: kinLogo,
    background: CHAINS.SOLANA.background,
    chain: CHAINS.SOLANA.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.SOLANA.background,
    chain: CHAINS.SOLANA.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    name: 'USDT',
    symbol: 'usdt',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.SOLANA.background,
    chain: CHAINS.SOLANA.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'CKaKtYvz6dKPyMvYq9Rh3UBrnNqYZAyd7iF4hJtjUvks',
    name: 'Gari',
    symbol: 'gari',
    decimals: 9,
    logo: gariLogo,
    background: CHAINS.SOLANA.background,
    chain: CHAINS.SOLANA.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB',
    name: 'GST',
    symbol: 'gst',
    decimals: 9,
    logo: gstLogo,
    background: CHAINS.SOLANA.background,
    chain: CHAINS.SOLANA.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default SOLANA_TOKENS

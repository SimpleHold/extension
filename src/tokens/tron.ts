import usdtLogo from '@assets/tokens/usdt.svg'
import btcLogo from '@assets/currencies/btc.svg'
import ethLogo from '@assets/currencies/eth.svg'
import usdcLogo from '@assets/tokens/usdc.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const TRON_TOKENS: TToken[] = [
  {
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    name: 'Tether USD',
    symbol: 'usdt',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.TRX.background,
    chain: CHAINS.TRX.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
    name: 'Bitcoin',
    symbol: 'btc',
    decimals: 8,
    logo: btcLogo,
    background: CHAINS.TRX.background,
    chain: CHAINS.TRX.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF',
    name: 'Ethereum',
    symbol: 'eth',
    decimals: 18,
    logo: ethLogo,
    background: CHAINS.TRX.background,
    chain: CHAINS.TRX.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.TRX.background,
    chain: CHAINS.TRX.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default TRON_TOKENS

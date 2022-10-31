import usdcLogo from '@assets/tokens/usdc.svg'
import fbtcLogo from '@assets/tokens/fbtc.svg'
import fethLogo from '@assets/tokens/feth.svg'
import staLogo from '@assets/tokens/sta.svg'
import wstaLogo from '@assets/tokens/wsta.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const ETH_TOKENS: TToken[] = [
  {
    address: '0xCEeBDE49eC95E21F7eE63C5c6f98CaB3519570de',
    name: 'Wrapped STA',
    symbol: 'wsta',
    decimals: 18,
    logo: wstaLogo,
    background: CHAINS.FTM.background,
    chain: CHAINS.FTM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x89D5e71E275B4bE094Df9551627BCF4E3b24cE22',
    name: 'Statera',
    symbol: 'sta',
    decimals: 18,
    logo: staLogo,
    background: CHAINS.FTM.background,
    chain: CHAINS.FTM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xe1146b9AC456fCbB60644c36Fd3F868A9072fc6E',
    name: 'fBTC',
    symbol: 'fbtc',
    decimals: 18,
    logo: fbtcLogo,
    background: CHAINS.FTM.background,
    chain: CHAINS.FTM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x658b0c7613e890EE50B8C4BC6A3f41ef411208aD',
    name: 'fETH',
    symbol: 'feth',
    decimals: 18,
    logo: fethLogo,
    background: CHAINS.FTM.background,
    chain: CHAINS.FTM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.FTM.background,
    chain: CHAINS.FTM.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default ETH_TOKENS

import busdLogo from '@assets/tokens/busd.svg'
import cakeLogo from '@assets/tokens/cake.svg'
import inchLogo from '@assets/tokens/inch.svg'
import adaLogo from '@assets/tokens/ada.svg'
import zilLogo from '@assets/tokens/zil.svg'
import sxpLogo from '@assets/tokens/sxp.svg'
import xvsLogo from '@assets/tokens/xvs.svg'
import linkLogo from '@assets/tokens/link.svg'
import toncoinLogo from '@assets/tokens/toncoin.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const ETH_TOKENS: TToken[] = [
  {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    name: 'BUSD Token',
    symbol: 'busd',
    decimals: 18,
    logo: busdLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    name: 'PancakeSwap',
    symbol: 'cake',
    decimals: 18,
    logo: cakeLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    name: '1INCH Token',
    symbol: '1inch',
    decimals: 18,
    logo: inchLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    name: 'Cardano Token',
    symbol: 'ada',
    decimals: 18,
    logo: adaLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    name: 'Swipe',
    symbol: 'sxp',
    decimals: 18,
    logo: sxpLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
    name: 'Venus',
    symbol: 'xvs',
    decimals: 18,
    logo: xvsLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xb86abcb37c3a4b64f74f59301aff131a1becc787',
    name: 'Zilliqa',
    symbol: 'zil',
    decimals: 12,
    logo: zilLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
    name: 'ChainLink Token',
    symbol: 'link',
    decimals: 18,
    logo: linkLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x76A797A59Ba2C17726896976B7B3747BfD1d220f',
    name: 'Wrapped TON Coin',
    symbol: 'toncoin',
    decimals: 9,
    logo: toncoinLogo,
    background: CHAINS.BSC.background,
    chain: CHAINS.BSC.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default ETH_TOKENS

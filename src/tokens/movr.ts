import usdtLogo from '@assets/tokens/usdt.svg'
import usdcLogo from '@assets/tokens/usdc.svg'
import daiLogo from '@assets/tokens/dai.svg'
import busdLogo from '@assets/tokens/busd.svg'
import fraxLogo from '@assets/tokens/frax.svg'
import rmrkLogo from '@assets/tokens/rmrk.svg'
import ksmLogo from '@assets/tokens/ksm.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const MOVR_TOKENS: TToken[] = [
  {
    address: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logo: usdtLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logo: usdcLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logo: daiLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x5d9ab5522c64e1f6ef5e3627eccc093f56167818',
    name: 'Binance-Peg BUSD Token',
    symbol: 'BUSD',
    decimals: 18,
    logo: busdLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0x1a93b23281cc1cde4c4741353f3064709a16197d',
    name: 'Frax',
    symbol: 'FRAX',
    decimals: 18,
    logo: fraxLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xffffffff893264794d9d57e1e0e21e0042af5a0a',
    name: 'xcRMRK',
    symbol: 'xcRMRK',
    decimals: 10,
    logo: rmrkLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    name: 'xcKSM',
    symbol: 'xcKSM',
    decimals: 12,
    logo: ksmLogo,
    background: CHAINS.MOVR.background,
    chain: CHAINS.MOVR.name,
    minSendAmount: CONFIG.MIN_SEND_AMOUNT,
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default MOVR_TOKENS

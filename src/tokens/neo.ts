import gasLogo from '@assets/tokens/gas.svg'
import nknLogo from '@assets/tokens/nkn.svg'
import flmLogo from '@assets/tokens/flm.svg'
import soulLogo from '@assets/tokens/soul.svg'

// Tokens
import CONFIG, { CHAINS } from '@tokens/config'
import { TToken } from '@tokens/types'

const NEO_TOKENS: TToken[] = [
  {
    address: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    name: 'Gas',
    symbol: 'gas',
    decimals: 0,
    logo: gasLogo,
    background: CHAINS.NEO.background,
    chain: CHAINS.NEO.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'c36aee199dbba6c3f439983657558cfb67629599',
    name: 'NKN',
    symbol: 'nkn',
    decimals: 8,
    logo: nknLogo,
    background: CHAINS.NEO.background,
    chain: CHAINS.NEO.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: '4d9eab13620fe3569ba3b0e56e2877739e4145e3',
    name: 'Flamingo',
    symbol: 'flm',
    decimals: 8,
    logo: flmLogo,
    background: CHAINS.NEO.background,
    chain: CHAINS.NEO.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
  {
    address: 'ed07cffad18f1308db51920d99a2af60ac66a7b3',
    name: 'Phantasma',
    symbol: 'soul',
    decimals: 8,
    logo: soulLogo,
    background: CHAINS.NEO.background,
    chain: CHAINS.NEO.name,
    minSendAmount: '1000',
    isCustomFee: CONFIG.IS_CUSTOM_FEE,
  },
]

export default NEO_TOKENS

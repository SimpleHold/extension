// Tokens logo
import usdtLogo from '@assets/tokens/usdt.svg'
import usdcLogo from '@assets/tokens/usdc.svg'
import daiLogo from '@assets/tokens/dai.svg'
import paxLogo from '@assets/tokens/pax.svg'
import busdLogo from '@assets/tokens/busd.svg'
import ustLogo from '@assets/tokens/ust.svg'
import enjLogo from '@assets/tokens/enj.svg'
import sandLogo from '@assets/tokens/sand.svg'
import litLogo from '@assets/tokens/lit.svg'
import exdrLogo from '@assets/tokens/exdr.svg'
import julLogo from '@assets/tokens/jul.svg'
import truLogo from '@assets/tokens/tru.svg'
import markLogo from '@assets/tokens/mark.svg'
import astaLogo from '@assets/tokens/asta.svg'
import bnbLogo from '@assets/tokens/bnb.svg'

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  platform: string
  logo: string
  background: string
  chain: string
}

const tokens: IToken[] = [
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether',
    symbol: 'usdt',
    decimals: 6,
    platform: 'eth',
    logo: usdtLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    platform: 'eth',
    logo: usdcLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'dai',
    decimals: 18,
    platform: 'eth',
    logo: daiLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    name: 'Paxos Standard',
    symbol: 'pax',
    decimals: 18,
    platform: 'eth',
    logo: paxLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    name: 'Binance USD',
    symbol: 'busd',
    decimals: 18,
    platform: 'eth',
    logo: busdLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    name: 'Wrapped UST Token',
    symbol: 'ust',
    decimals: 18,
    platform: 'eth',
    logo: ustLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    name: 'Enjin Coin',
    symbol: 'enj',
    decimals: 18,
    platform: 'eth',
    logo: enjLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
    name: 'The Sandbox',
    symbol: 'sand',
    decimals: 18,
    platform: 'eth',
    logo: sandLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    name: 'Litentry',
    symbol: 'lit',
    decimals: 18,
    platform: 'eth',
    logo: litLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x6468e79A80C0eaB0F9A2B574c8d5bC374Af59414',
    name: 'e-Darix',
    symbol: 'exdr',
    decimals: 18,
    platform: 'eth',
    logo: exdrLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x5580ab97F226C324c671746a1787524AEF42E415',
    name: 'JustLiquidity',
    symbol: 'jul',
    decimals: 18,
    platform: 'eth',
    logo: julLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    name: 'TrueFi',
    symbol: 'tru',
    decimals: 8,
    platform: 'eth',
    logo: truLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0x67c597624b17b16fb77959217360b7cd18284253',
    name: 'Benchmark',
    symbol: 'mark',
    decimals: 9,
    platform: 'eth',
    logo: markLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xf2ddae89449b7d26309a5d54614b1fc99c608af5',
    name: 'Asta',
    symbol: 'asta',
    decimals: 18,
    platform: 'eth',
    logo: astaLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
  {
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    name: 'Binance Coin',
    symbol: 'bnb',
    decimals: 18,
    platform: 'eth',
    logo: bnbLogo,
    background: '#132BD8',
    chain: 'ethereum',
  },
]
export const getToken = (symbol: String, platform: string) => {
  return tokens.find((token: IToken) => token.symbol === symbol && token.platform === platform)
}

export const validateContractAddress = (address: string, platform: string): boolean => {
  if (platform === 'eth' || platform === 'bsc') {
    return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
  }
  return false
}

export default tokens

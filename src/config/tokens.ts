// Tokens logo
import tetherLogo from '@assets/currencies/usdt.svg'
import usdCoinLogo from '@assets/currencies/usdc.svg'

type TTokenPlatforms = 'eth' | 'bsc'

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  platform: TTokenPlatforms
  logo: string
  background: string
}

const tokens: IToken[] = [
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether',
    symbol: 'usdt',
    decimals: 6,
    platform: 'eth',
    logo: tetherLogo,
    background: '#132BD8',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'dai',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    name: 'Paxos Standard',
    symbol: 'pax',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    name: 'Wrapped UST Token',
    symbol: 'ust',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    name: 'Enjin Coin',
    symbol: 'enj',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
    name: 'The Sandbox',
    symbol: 'sand',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    name: 'Litentry',
    symbol: 'lit',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0x6468e79A80C0eaB0F9A2B574c8d5bC374Af59414',
    name: 'Radix',
    symbol: 'exdr',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
  {
    address: '0x5580ab97F226C324c671746a1787524AEF42E415',
    name: 'JustLiquidity',
    symbol: 'jul',
    decimals: 18,
    platform: 'eth',
    logo: usdCoinLogo,
    background: '#132BD8',
  },
]

export const getToken = (symbol: String, platform: TTokenPlatforms) => {
  return tokens.find((token: IToken) => token.symbol === symbol && token.platform === platform)
}

export const validateContractAddress = (address: string, platform: TTokenPlatforms): boolean => {
  if (platform === 'eth' || platform === 'bsc') {
    return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
  }
  return false
}

export default tokens

export interface IPlatform {
  name: string
  symbol: string
}

const platforms: IPlatform[] = [
  {
    name: 'Ethereum',
    symbol: 'eth',
  },
  {
    name: 'Binance Coin',
    symbol: 'bnb',
  },
]

export const getPlatform = (symbol: string): IPlatform | undefined => {
  return platforms.find((platform: IPlatform) => platform.symbol === symbol)
}

export default platforms

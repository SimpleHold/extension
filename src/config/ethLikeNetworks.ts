// Utils
import { toLower } from '@utils/format'

export interface IEthNetwork {
  name: string
  symbol: string
  chain: string
}

const networks: IEthNetwork[] = [
  {
    name: 'Ethereum',
    symbol: 'eth',
    chain: 'eth',
  },
  {
    name: 'Binance Smart Chain',
    symbol: 'bnb',
    chain: 'bsc',
  },
  {
    name: 'Polygon',
    symbol: 'matic',
    chain: 'matic',
  },
  {
    name: 'Fantom Opera',
    symbol: 'ftm',
    chain: 'ftm',
  },
]

export const getEthNetwork = (chain: string): IEthNetwork | undefined => {
  return networks.find((network: IEthNetwork) => toLower(network.chain) === toLower(chain))
}

export default networks

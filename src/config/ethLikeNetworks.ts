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
    name: 'Binance smart chain',
    symbol: 'bnb',
    chain: 'bsc',
  },
]

export const getEthNetwork = (symbol: string): IEthNetwork | undefined => {
  return networks.find((network: IEthNetwork) => toLower(network.symbol) === toLower(symbol))
}

export default networks

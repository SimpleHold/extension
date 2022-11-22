import ethLogo from '@assets/currencies/eth.svg'
import bnbLogo from '@assets/currencies/bnb.svg'
import maticLogo from '@assets/currencies/matic.svg'
import ftmLogo from '@assets/currencies/ftm.svg'
import avaxLogo from '@assets/currencies/avax.svg'
import movrLogo from '@assets/currencies/movr.svg'
import aethLogo from '@assets/currencies/aeth.svg'
import trxLogo from '@assets/currencies/trx.svg'
import solLogo from '@assets/currencies/sol.svg'
import adaLogo from '@assets/currencies/ada.svg'
import luncLogo from '@assets/currencies/lunc.svg'
import neoLogo from '@assets/currencies/neo.svg'
import xtzLogo from '@assets/currencies/xtz.svg'

// Utils
import { toLower } from '@utils/format'

// Config
import { CHAINS_COLOR } from '@config/colors'

export interface TNetwork {
  name: string
  symbol: string
  chain: string
  chainId: number
  color: string
  icon: string
}

export const networks: TNetwork[] = [
  {
    name: 'Ethereum',
    symbol: 'eth',
    chain: 'eth',
    chainId: 1,
    color: CHAINS_COLOR.ETH,
    icon: ethLogo,
  },
  {
    name: 'Binance Smart Chain',
    symbol: 'bnb',
    chain: 'bsc',
    chainId: 56,
    color: CHAINS_COLOR.BSC,
    icon: bnbLogo,
  },
  {
    name: 'Polygon',
    symbol: 'matic',
    chain: 'matic',
    chainId: 137,
    color: CHAINS_COLOR.MATIC,
    icon: maticLogo,
  },
  {
    name: 'Fantom Opera',
    symbol: 'ftm',
    chain: 'ftm',
    chainId: 250,
    color: CHAINS_COLOR.FTM,
    icon: ftmLogo,
  },
  {
    name: 'Avalanche C-Chain',
    symbol: 'avax',
    chain: 'avax',
    chainId: 43114,
    color: CHAINS_COLOR.AVAX,
    icon: avaxLogo,
  },
  {
    name: 'Moonriver',
    symbol: 'movr',
    chain: 'movr',
    chainId: 1285,
    color: CHAINS_COLOR.MOVR,
    icon: movrLogo,
  },
  {
    name: 'Arbitrum One',
    symbol: 'aeth',
    chain: 'arbitrum',
    chainId: 42161,
    color: CHAINS_COLOR.ARBITRUM,
    icon: aethLogo,
  },
]

export const TRON_NETWORK: TNetwork = {
  name: 'Tron',
  symbol: 'trx',
  chain: 'tron',
  chainId: -1,
  color: CHAINS_COLOR.TRX,
  icon: trxLogo,
}

export const SOLANA_NETWORK: TNetwork = {
  name: 'Solana',
  symbol: 'sol',
  chain: 'solana',
  chainId: -1,
  color: CHAINS_COLOR.SOL,
  icon: solLogo,
}

export const CARDANO_NETWORK: TNetwork = {
  name: 'Cardano',
  symbol: 'ada',
  chain: 'cardano',
  chainId: -1,
  color: CHAINS_COLOR.ADA,
  icon: adaLogo,
}

export const TERRA_CLASSIC_NETWORK: TNetwork = {
  name: 'Terra Classic',
  symbol: 'lunc',
  chain: 'terra-classic',
  chainId: -1,
  color: CHAINS_COLOR.LUNC,
  icon: luncLogo,
}

export const NEO_NETWORK: TNetwork = {
  name: 'Neo',
  symbol: 'neo',
  chain: 'neo',
  chainId: -1,
  color: CHAINS_COLOR.NEO,
  icon: neoLogo,
}

export const TEZOS_NETWORK: TNetwork = {
  name: 'Tezos',
  symbol: 'xtz',
  chain: 'tezos',
  chainId: -1,
  color: CHAINS_COLOR.XTZ,
  icon: xtzLogo,
}

export const ALL_NETWORK: TNetwork = {
  name: 'All',
  symbol: 'all',
  chain: 'all',
  chainId: -1,
  color: '',
  icon: '-1',
}

export const NOT_ETH_NETWORKS: TNetwork[] = [
  TRON_NETWORK,
  SOLANA_NETWORK,
  TERRA_CLASSIC_NETWORK,
  NEO_NETWORK,
]

export const getNetwork = (chain: string): TNetwork | undefined => {
  return networks.find((network: TNetwork) => toLower(network.chain) === toLower(chain))
}

export const getNetworkByChainId = (chainId: number): TNetwork | undefined => {
  return networks.find((network: TNetwork) => network.chainId === chainId)
}

export default networks

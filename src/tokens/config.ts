// Config
import { CHAINS_COLOR } from '@config/colors'

export const CHAINS = {
  ETH: {
    name: 'eth',
    background: CHAINS_COLOR.ETH,
  },
  BSC: {
    name: 'bsc',
    background: CHAINS_COLOR.BSC,
  },
  MATIC: {
    name: 'matic',
    background: CHAINS_COLOR.MATIC,
  },
  FTM: {
    name: 'ftm',
    background: CHAINS_COLOR.FTM,
  },
  TRX: {
    name: 'tron',
    background: CHAINS_COLOR.TRX,
  },
  AVAX: {
    name: 'avax',
    background: CHAINS_COLOR.AVAX,
  },
  SOLANA: {
    name: 'solana',
    background: CHAINS_COLOR.SOL,
  },
  ADA: {
    name: 'cardano',
    background: CHAINS_COLOR.ADA,
  },
  TERRA_CLASSIC: {
    name: 'terra-classic',
    background: CHAINS_COLOR.LUNC,
  },
  NEO: {
    name: 'neo',
    background: CHAINS_COLOR.NEO,
  },
  MOVR: {
    name: 'movr',
    background: CHAINS_COLOR.MOVR,
  },
  ARBITRUM: {
    name: 'arbitrum',
    background: CHAINS_COLOR.ARBITRUM,
  },
}

const CONFIG = {
  MIN_SEND_AMOUNT: '1000000000000000',
  IS_CUSTOM_FEE: true,
}

export default CONFIG

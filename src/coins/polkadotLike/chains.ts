// Types
import { TChain } from './types';

const chains: TChain[] = [
  {
    chain: 'polkadot',
    ss58Format: 0,
    keypairType: 'sr25519',
    wsUrl: 'wss://rpc.polkadot.io',
    decimals: 10,
    symbol: 'dot',
  },
  {
    chain: 'kusama',
    ss58Format: 2,
    keypairType: 'sr25519',
    wsUrl: 'wss://kusama-rpc.polkadot.io',
    decimals: 12,
    symbol: 'ksm',
  },
  {
    chain: 'shiden',
    ss58Format: 5,
    keypairType: 'sr25519',
    wsUrl: 'wss://rpc.shiden.astar.network',
    decimals: 18,
    symbol: 'sdn',
  },
  {
    chain: 'reef',
    ss58Format: 42,
    keypairType: 'sr25519',
    wsUrl: 'wss://rpc.reefscan.com/ws',
    decimals: 18,
    symbol: 'reef',
  },
  {
    chain: 'acala',
    ss58Format: 10,
    keypairType: 'sr25519',
    wsUrl: 'wss://acala-rpc.dwellir.com',
    decimals: 12,
    symbol: 'aca',
  },
];

export default chains;

// Types
import { TChain } from './types'

const chains: TChain[] = [
  {
    chain: 'eth',
    explorerLink: 'https://etherscan.io/address/ADDR',
    tokenExplorerLink: 'https://etherscan.io/token/CA?a=ADDR',
    txLink: 'https://etherscan.io/tx/HASH',
  },
  {
    chain: 'etc',
    explorerLink:
      'https://blockscout.com/etc/mainnet/address/ADDR/transactions',
    tokenExplorerLink: '',
    txLink: 'https://blockscout.com/etc/mainnet/tx/HASH/internal-transactions',
  },
  {
    chain: 'bsc',
    explorerLink: 'https://bscscan.com/address/ADDR',
    tokenExplorerLink: 'https://bscscan.com/token/CA?a=ADDR',
    txLink: 'https://bscscan.com/tx/HASH',
  },
  {
    chain: 'matic',
    explorerLink: 'https://polygonscan.com/address/ADDR',
    tokenExplorerLink: 'https://polygonscan.com/token/CA?a=ADDR',
    txLink: 'https://polygonscan.com/tx/HASH',
  },
  {
    chain: 'ftm',
    explorerLink: 'https://ftmscan.com/address/ADDR',
    tokenExplorerLink: 'https://ftmscan.com/token/CA?a=ADDR',
    txLink: 'https://ftmscan.com/tx/HASH',
  },
  {
    chain: 'avax',
    explorerLink: 'https://snowtrace.io/address/ADDR',
    tokenExplorerLink: 'https://snowtrace.io/token/CA?a=ADDR',
    txLink: 'https://snowtrace.io/tx/HASH',
  },
  {
    chain: 'oeth',
    explorerLink: 'https://optimistic.etherscan.io/address/ADDR',
    tokenExplorerLink: 'https://optimistic.etherscan.io/token/CA?a=ADDR',
    txLink: 'https://optimistic.etherscan.io/tx/HASH',
  },
  {
    chain: 'movr',
    explorerLink: 'https://moonriver.moonscan.io/address/ADDR',
    tokenExplorerLink: 'https://moonriver.moonscan.io/token/CA?a=ADDR',
    txLink: 'https://moonriver.moonscan.io/tx/HASH',
  },
  {
    chain: 'arbitrum',
    explorerLink: 'https://arbiscan.io/address/ADDR',
    tokenExplorerLink: 'https://arbiscan.io/token/CA?a=ADDR',
    txLink: 'https://arbiscan.io/tx/HASH',
  },
  {
    chain: 'rei',
    explorerLink: 'https://scan.rei.network/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://scan.rei.network/tx/HASH',
  },
  {
    chain: 'energy-web',
    explorerLink: 'https://explorer.energyweb.org/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://explorer.energyweb.org/tx/HASH',
  },
  {
    chain: 'gnosis',
    explorerLink: 'https://gnosisscan.io/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://gnosisscan.io/tx/HASH',
  },
  {
    chain: 'okx',
    explorerLink: 'https://www.oklink.com/en/okc/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://www.oklink.com/en/okc/tx/HASH',
  },
  {
    chain: 'aurora',
    explorerLink: 'https://aurorascan.dev/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://aurorascan.dev/tx/HASH',
  },
  {
    chain: 'celo',
    explorerLink: 'https://celoscan.io/address/ADDR',
    tokenExplorerLink: '',
    txLink: 'https://celoscan.io/tx/HASH',
  },
]

export default chains

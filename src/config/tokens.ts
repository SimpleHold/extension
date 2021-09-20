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
import cakeLogo from '@assets/tokens/cake.svg'
import inchLogo from '@assets/tokens/inch.svg'
import shibLogo from '@assets/tokens/shib.svg'
import adaLogo from '@assets/tokens/ada.svg'
import ctsiLogo from '@assets/tokens/ctsi.svg'
import zilLogo from '@assets/tokens/zil.svg'
import sxpLogo from '@assets/tokens/sxp.svg'
import xvsLogo from '@assets/tokens/xvs.svg'

// Utils
import { IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Config
import { getCurrencyByChain } from '@config/currencies'

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  logo: string
  background: string
  chain: string
  minSendAmount: number
  isCustomFee: boolean
}

const tokens: IToken[] = [
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether',
    symbol: 'usdt',
    decimals: 6,
    logo: usdtLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'usdc',
    decimals: 6,
    logo: usdcLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'dai',
    decimals: 18,
    logo: daiLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    name: 'Paxos Standard',
    symbol: 'pax',
    decimals: 18,
    logo: paxLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    name: 'Binance USD',
    symbol: 'busd',
    decimals: 18,
    logo: busdLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    name: 'Wrapped UST Token',
    symbol: 'ust',
    decimals: 18,
    logo: ustLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    name: 'Enjin Coin',
    symbol: 'enj',
    decimals: 18,
    logo: enjLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
    name: 'The Sandbox',
    symbol: 'sand',
    decimals: 18,
    logo: sandLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
    name: 'Litentry',
    symbol: 'lit',
    decimals: 18,
    logo: litLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x6468e79A80C0eaB0F9A2B574c8d5bC374Af59414',
    name: 'e-Darix',
    symbol: 'exdr',
    decimals: 18,
    logo: exdrLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x5580ab97F226C324c671746a1787524AEF42E415',
    name: 'JustLiquidity',
    symbol: 'jul',
    decimals: 18,
    logo: julLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    name: 'TrueFi',
    symbol: 'tru',
    decimals: 8,
    logo: truLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x67c597624b17b16fb77959217360b7cd18284253',
    name: 'Benchmark',
    symbol: 'mark',
    decimals: 9,
    logo: markLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xf2ddae89449b7d26309a5d54614b1fc99c608af5',
    name: 'Asta',
    symbol: 'asta',
    decimals: 18,
    logo: astaLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    name: 'Binance Coin',
    symbol: 'bnb',
    decimals: 18,
    logo: bnbLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    name: 'SHIBA INU',
    symbol: 'shib',
    decimals: 18,
    logo: shibLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    name: 'BUSD Token',
    symbol: 'busd',
    decimals: 18,
    logo: busdLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    name: 'PancakeSwap',
    symbol: 'cake',
    decimals: 18,
    logo: cakeLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    name: '1INCH Token',
    symbol: '1inch',
    decimals: 18,
    logo: inchLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    name: 'Cardano Token',
    symbol: 'ada',
    decimals: 18,
    logo: adaLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
    name: 'Cartesi Token',
    symbol: 'ctsi',
    decimals: 18,
    logo: ctsiLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
    name: 'Swipe',
    symbol: 'sxp',
    decimals: 18,
    logo: sxpLogo,
    background: '#132BD8',
    chain: 'eth',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    name: 'Swipe',
    symbol: 'sxp',
    decimals: 18,
    logo: sxpLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
    name: 'Venus',
    symbol: 'xvs',
    decimals: 18,
    logo: xvsLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
  {
    address: '0xb86abcb37c3a4b64f74f59301aff131a1becc787',
    name: 'Zilliqa',
    symbol: 'zil',
    decimals: 12,
    logo: zilLogo,
    background: '#EBBB4E',
    chain: 'bsc',
    minSendAmount: 0.001,
    isCustomFee: true,
  },
]

export default tokens

export const getToken = (symbol: string, chain: string) => {
  return tokens.find(
    (token: IToken) =>
      toLower(token.symbol) === toLower(symbol) && toLower(token.chain) === toLower(chain)
  )
}

export const validateContractAddress = (address: string, chain: string): boolean => {
  if (chain === 'eth' || chain === 'bsc') {
    return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
  }
  return false
}

export const checkExistWallet = (
  walletsList: IWallet[],
  symbol: string,
  chain: string
): boolean => {
  const getCurrencyInfo = getCurrencyByChain(chain)

  if (getCurrencyInfo) {
    const getWalletsByChain = walletsList.filter(
      (wallet) => toLower(wallet.symbol) === toLower(getCurrencyInfo.symbol)
    )

    if (getWalletsByChain.length) {
      let result = 0

      for (const wallet of getWalletsByChain) {
        const { address, hardware } = wallet

        const findExist = walletsList.find(
          (walletItem: IWallet) =>
            toLower(walletItem.address) === toLower(address) &&
            toLower(walletItem.symbol) === toLower(symbol) &&
            toLower(walletItem?.chain) === toLower(chain)
        )

        if (!findExist && !hardware) {
          result += 1
        }
      }

      return result > 0
    }
  }
  return false
}

export const getUnusedAddressesForToken = (
  walletsList: IWallet[],
  symbol: string,
  chain: string
): string[] => {
  const addresses: string[] = []
  const getCurrencyInfo = getCurrencyByChain(chain)

  if (getCurrencyInfo) {
    const filterWallets = walletsList.filter(
      (wallet: IWallet) => toLower(wallet.symbol) === toLower(getCurrencyInfo.symbol)
    )

    for (const wallet of filterWallets) {
      const { hardware, address } = wallet

      const findExist = walletsList.find(
        (walletItem: IWallet) =>
          toLower(walletItem.address) === toLower(address) &&
          toLower(walletItem.symbol) === toLower(symbol) &&
          toLower(walletItem.chain) === toLower(getCurrencyInfo.chain)
      )

      if (!findExist && !hardware) {
        addresses.push(address)
      }
    }
  }

  return addresses
}

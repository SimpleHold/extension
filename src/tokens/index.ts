// Utils
import { toLower } from '@utils/format'
import { getItem } from '@utils/storage'

// Config
import { getCurrencyByChain } from '@config/currencies/utils'
import networks, { TNetwork } from '@config/networks'

// Tokens
import ETH_TOKENS from '@tokens/eth'
import BSC_TOKENS from '@tokens/bsc'
import MATIC_TOKENS from '@tokens/matic'
import FANTOM_TOKENS from '@tokens/fantom'
import TRON_TOKENS from '@tokens/tron'
import AVAX_TOKENS from '@tokens/avax'
import SOLANA_TOKENS from '@tokens/solana'
import TERRA_CLASSIC_TOKENS from '@tokens/terraClassic'
import NEO_TOKENS from '@tokens/neo'
import MOVR_TOKENS from '@tokens/movr'
import ARBITRUM_TOKENS from '@tokens/arbitrum'

// Types
import { IWallet } from '@utils/wallet'
import { TToken } from '@tokens/types'

const tokens: TToken[] = [
  ...ETH_TOKENS,
  ...BSC_TOKENS,
  ...MATIC_TOKENS,
  ...FANTOM_TOKENS,
  ...TRON_TOKENS,
  ...AVAX_TOKENS,
  ...SOLANA_TOKENS,
  ...TERRA_CLASSIC_TOKENS,
  ...NEO_TOKENS,
  ...MOVR_TOKENS,
  ...ARBITRUM_TOKENS,
]

export default tokens

export const getSharedTokens = (): TToken[] => {
  try {
    const getTokens = getItem('tokens')

    if (getTokens) {
      return JSON.parse(getTokens)
    }

    return []
  } catch {
    return []
  }
}

export const getSharedToken = (symbol: string, chain?: string): TToken | undefined => {
  try {
    const getTokens = getSharedTokens()

    if (getTokens.length) {
      return getTokens.find(
        (token: TToken) =>
          toLower(token.symbol) === toLower(symbol) && toLower(token.chain) === toLower(chain)
      )
    }

    return undefined
  } catch {
    return undefined
  }
}

export const getToken = (symbol: string, chain: string): TToken | undefined => {
  return [...tokens, ...getSharedTokens()].find(
    (token: TToken) =>
      toLower(token.symbol) === toLower(symbol) && toLower(token.chain) === toLower(chain)
  )
}

export const validateContractAddress = (address: string, chain: string): boolean => {
  const mapNetworksIds = networks.map((network: TNetwork) => network.chain)

  let pattern

  if (mapNetworksIds.indexOf(chain) !== -1) {
    pattern = '^(0x)[0-9A-Fa-f]{40}$'
  }

  if (chain === 'tron') {
    pattern = '^T[0-9A-Za-z]{33}$'
  }

  if (chain === 'solana') {
    pattern = '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
  }

  if (chain === 'cardano') {
    pattern = '^(([1-9A-HJ-NP-Za-km-z]{59})|([0-9A-Za-z]{100,104}))$|^(addr)[0-9A-Za-z]{45,65}$'
  }

  if (chain === 'terra-classic') {
    pattern = '^(terra)[0-9A-Za-z]{30,70}$'
  }

  if (pattern) {
    return new RegExp(pattern).test(address)
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

export const getStandart = (chain?: string): string => {
  if (chain === 'bsc') {
    return 'BEP20'
  }

  if (chain === 'tron') {
    return 'TRC20'
  }

  if (chain === 'cardano') {
    return 'Cardano Native'
  }

  if (chain === 'terra-classic') {
    return 'Terra'
  }

  if (chain === 'neo') {
    return 'NEP5'
  }

  return 'ERC20'
}

export const getUnusedAddresses = (
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

export const checkNotEthToken = (token: TToken): boolean => {
  const list = [...TRON_TOKENS, ...SOLANA_TOKENS, ...TERRA_CLASSIC_TOKENS, ...NEO_TOKENS]

  return list.find((i: TToken) => i.symbol === token.symbol) !== undefined
}

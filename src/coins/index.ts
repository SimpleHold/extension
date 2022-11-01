import {
  BitcoinLike,
  Cardano,
  Tron,
  Theta,
  Neo,
  Nuls,
  Nerve,
  Xrp,
  Stellar,
  Harmony,
  Zilliqa,
  Tezos,
  Xinfin,
  Terra,
  Waves,
  Qtum,
  Near,
  Icon,
  Sxp,
  Iota,
  Neblio,
  Solana,
  PolkadotLike,
  Iotex,
  FioProtocol,
  Elrond,
  Casper,
  Aptos,
} from './dist'
import find from 'lodash/find'

// Coins
import * as ethereumLike from '@coins/ethereumLike'
import * as verge from '@coins/verge'
import * as toncoin from '@coins/toncoin'
import * as cosmosLike from '@coins/cosmosLike'
import * as hedera from '@coins/hedera'
import * as vechain from '@coins/vechain'
import * as digibyte from '@coins/digibyte'
import * as ravencoin from '@coins/ravencoin'
import * as nano from '@coins/nano'

// Utils
import {
  getBalanceDiff,
  getBalancePrecision,
  getLatestBalance,
  getSingleWallet,
  getWalletChain,
  saveBalanceData,
  TBalanceData,
} from '@utils/wallet'
import { checkIfTimePassed } from '@utils/dates'
import { getItem, removeItem, setItem } from '@utils/storage'
import { getEtherNetworkFee, fetchBalances } from '@utils/api'
import {
  logErrorCreateTx,
  logErrorGenerateAddress,
  logErrorImportPrivateKey,
  logEvent,
} from '@utils/metrics'
import { getCurrencyBalance } from './utils'

// Tokens
import { getSharedToken, getToken } from '@tokens/index'

// Config
import { getCurrencyByChain } from '@config/currencies/utils'
import { NOT_ETH_NETWORKS, TNetwork } from '@config/networks'
import { GENERAL_BALANCE_CHANGE } from '@config/events'

// Types
import {
  TProvider,
  TGenerateAddress,
  TUnspentOutput,
  TFeeProps,
  TCreateTxProps,
  TInternalTxProps,
} from './types'
import { TFeeResponse } from '@utils/api/types'
import { IGetBalances, TGetBalanceOptions, TGetBalanceWalletProps } from '@utils/api/types'

const providers: TProvider[] = [
  ethereumLike,
  BitcoinLike,
  Tron,
  Theta,
  Nuls,
  Nerve,
  Cardano,
  Xrp,
  Neblio,
  verge,
  Xinfin,
  Solana,
  Harmony,
  Zilliqa,
  Terra,
  PolkadotLike,
  toncoin,
  Iotex,
  Stellar,
  cosmosLike,
  Neo,
  Tezos,
  FioProtocol,
  Waves,
  Qtum,
  Near,
  Icon,
  Sxp,
  Iota,
  Elrond,
  Casper,
  Aptos,
  hedera,
  vechain,
  digibyte,
  ravencoin,
  nano,
]

const getProvider = (symbol: string, tokenChain?: string): TProvider | null => {
  if (tokenChain) {
    if (tokenChain === 'terra-classic') {
      return Terra
    }

    if (tokenChain === 'tron') {
      return Tron
    }

    if (tokenChain === 'solana') {
      return Solana
    }

    if (tokenChain === 'cardano') {
      return Cardano
    }

    if (tokenChain === 'neo') {
      return Neo
    }

    return ethereumLike
  }

  return find(providers, (provider) => provider.config.coins.indexOf(symbol) !== -1) || null
}

export const generateAddress = async (
  symbol: string,
  chain: string,
  tokenChain?: string
): Promise<TGenerateAddress | null> => {
  try {
    const provider = getProvider(symbol, tokenChain)

    if (provider) {
      return await provider.generateAddress(symbol, chain, tokenChain)
    }

    return null
  } catch (err) {
    logErrorGenerateAddress(`${err}`, symbol, chain)
    return null
  }
}

export const importPrivateKey = async (
  symbol: string,
  privateKey: string,
  tokenChain?: string
): Promise<string | null> => {
  try {
    const provider = getProvider(symbol, tokenChain)

    if (provider?.importPrivateKey) {
      return await provider.importPrivateKey(privateKey, symbol)
    }

    return null
  } catch (err) {
    logErrorImportPrivateKey(`${err}`, symbol, tokenChain)

    return null
  }
}

export const getExplorerLink = (
  address: string,
  chain: string,
  symbol: string,
  tokenChain?: string,
  contractAddress?: string
): string | null => {
  const provider = getProvider(symbol, tokenChain)

  if (provider) {
    return provider.getExplorerLink(address, chain, tokenChain, contractAddress, symbol)
  }

  return null
}

export const getTransactionLink = (
  hash: string,
  chain: string,
  symbol: string,
  tokenChain?: string
): string | null => {
  const provider = getProvider(symbol, tokenChain)

  if (provider) {
    return provider.getTransactionLink(hash, chain)
  }

  return null
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  try {
    const { symbol, amount, from, chain, outputs, tokenChain, contractAddress, decimals } = props

    const provider = getProvider(symbol, tokenChain)

    if (provider) {
      if (provider?.getStandingFee?.(symbol, chain, tokenChain) || provider.config?.isZeroFee) {
        let utxos: TUnspentOutput[] = []

        if (symbol === 'doge') {
          utxos = BitcoinLike.getUtxos('doge', outputs, amount)
        }

        const currencyBalance = await getCurrencyBalance(from, tokenChain)

        return {
          networkFee: provider?.getStandingFee?.(symbol, chain, tokenChain),
          utxos,
          isZeroFee: provider.config?.isZeroFee,
          currencyBalance,
        }
      }

      const mapNotEthNetworks = NOT_ETH_NETWORKS.map((network: TNetwork) => network.chain)

      if (
        ethereumLike.config.coins.indexOf(symbol) !== -1 ||
        (tokenChain && mapNotEthNetworks.indexOf(tokenChain) === -1)
      ) {
        const to = (await ethereumLike.generateAddress())?.address || ''
        const value = decimals
          ? ethereumLike.convertDecimals(amount, decimals)
          : ethereumLike.toEther(amount)

        return await getEtherNetworkFee(
          from,
          to,
          value,
          tokenChain || chain,
          tokenChain ? symbol : undefined,
          contractAddress,
          decimals
        )
      }

      if (provider?.getNetworkFee) {
        return await provider.getNetworkFee(props)
      }
    }

    return {
      networkFee: 0,
      isZeroFee: checkIsZeroFee(chain),
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const checkIsInternalTx = (symbol: string, tokenChain?: string): boolean => {
  const provider = getProvider(symbol, tokenChain)

  if (provider?.config?.isInternalTx) {
    return true
  }

  if (tokenChain && !isEthChain) {
    return true
  }

  return false
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  try {
    const { symbol, tokenChain } = props
    const provider = getProvider(symbol, tokenChain)

    if (provider?.createInternalTx) {
      return await provider.createInternalTx(props)
    }

    return null
  } catch (err) {
    logErrorCreateTx(`${err}`, props.symbol, props.tokenChain)
    return null
  }
}

export const validateAddress = (
  symbol: string,
  address: string,
  chain: string,
  tokenChain?: string
): boolean => {
  try {
    const provider = getProvider(symbol, tokenChain)

    if (provider) {
      return provider.validateAddress(address, symbol, chain)
    }

    return false
  } catch {
    return false
  }
}

export const checkIsCustomFee = (symbol: string, tokenChain?: string): boolean => {
  if (BitcoinLike.config.coins.indexOf(symbol) !== -1) {
    return symbol !== 'doge'
  }

  const ethLikeIgnore = ['oeth', 'movr', 'etc', 'aeth', 'rei', 'ewt', 'okt', 'xdai', 'celo']

  if (ethereumLike.config.coins.indexOf(symbol) !== -1 && ethLikeIgnore.indexOf(symbol) === -1) {
    return true
  }

  if (tokenChain === 'arbitrum') {
    return false
  }

  if (tokenChain && isEthChain(tokenChain)) {
    return true
  }

  return false
}

export const isEthChain = (chain?: string): boolean => {
  if (chain) {
    const mapNotEthNetworks = NOT_ETH_NETWORKS.map((network: TNetwork) => network.chain)

    return mapNotEthNetworks.indexOf(chain) === -1
  }

  return true
}

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  try {
    const provider = getProvider(props.symbol, props.tokenChain)

    if (provider?.createTx) {
      return await provider.createTx(props)
    }

    return null
  } catch (err) {
    logErrorCreateTx(`${err}`, props.symbol, props.tokenChain)

    return null
  }
}

export const checkWithOutputs = (symbol: string, tokenChain?: string): boolean => {
  try {
    if (tokenChain === 'cardano') {
      return true
    }

    const provider = getProvider(symbol)

    return provider?.config?.isWithOutputs || false
  } catch {
    return false
  }
}

export const getList = (symbol: string, tokenChain?: string): string[] => {
  if (vechain.config.coins.indexOf(symbol) !== -1) {
    return vechain.config.coins.sort(
      (a: string, b: string) => b.indexOf(symbol) - a.indexOf(symbol)
    )
  }

  if (Theta.config.coins.indexOf(symbol) !== -1) {
    return Theta.config.coins.sort(
      (a: string, b: string) => Number(b.indexOf(symbol) !== -1) - Number(a.indexOf(symbol) !== -1)
    )
  }

  if (tokenChain) {
    const currencyInfo = getCurrencyByChain(tokenChain)

    if (currencyInfo) {
      return [symbol, currencyInfo.symbol]
    }
  }

  return [symbol]
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (Theta.config.coins.indexOf(symbol) !== -1) {
      return 'tfuel'
    }

    if (symbol === 'oeth') {
      return 'eth'
    }

    if (symbol === 'neo' || tokenChain === 'neo') {
      return 'gas'
    }

    if (tokenChain) {
      return getCurrencyByChain(tokenChain)?.symbol || symbol
    }

    return symbol
  } catch {
    return symbol
  }
}

export const formatUnit = (
  symbol: string,
  value: string | number,
  type: 'from' | 'to',
  tokenChain?: string
): string | number => {
  try {
    const provider = getProvider(symbol, tokenChain)

    if (provider) {
      return provider.formatValue(value, type, symbol)
    }
    return 0
  } catch {
    return 0
  }
}

export const importRecoveryPhrase = async (
  symbol: string,
  recoveryPhrase: string,
  chain: string,
  tokenChain?: string
): Promise<TGenerateAddress | null> => {
  try {
    const provider = getProvider(symbol, tokenChain)

    if (provider?.importRecoveryPhrase) {
      return provider.importRecoveryPhrase(recoveryPhrase, symbol, chain)
    }

    return null
  } catch {
    return null
  }
}

export const getExtraIdName = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  return provider?.config?.extraIdName || null
}

export const generateExtraId = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  if (provider?.generateExtraId) {
    return provider.generateExtraId()
  }

  return null
}

export const checkWithPhrase = (symbol: string, tokenChain?: string): boolean => {
  const provider = getProvider(symbol, tokenChain)

  if (provider?.config?.isWithPhrase) {
    return true
  }

  return false
}

export const getPhraseWordSize = (symbol: string): number[] => {
  const provider = getProvider(symbol)

  return provider?.config?.wordsSize || [24]
}

export const isGenerateExtraId = (symbol: string): boolean => {
  const provider = getProvider(symbol)

  return provider?.config?.isGenerateExtraId || false
}

export const getContractUrl = (address: string, chain?: string): string | null => {
  if (chain === 'sol') {
    return `https://explorer.solana.com/address/${address}`
  } else if (chain === 'eth') {
    return `https://etherscan.io/address/${address}`
  } else if (chain === 'matic') {
    return `https://polygonscan.com/address/${address}`
  } else if (chain === 'bsc') {
    return `https://bscscan.com/address/${address}`
  } else if (chain === 'tezos') {
    return `https://tzstats.com/${address}`
  }

  return null
}

export const checkIsTokenWithMnemonic = (tokenChain: string): boolean => {
  return tokenChain === 'terra-classic' || tokenChain === 'cardano' || tokenChain === 'tezos'
}

export const checkIsZeroFee = (chain: string): boolean => {
  if (chain === 'gravity-bridge') {
    return true
  }

  return false
}

export const checkWithExplorer = (symbol: string): boolean => {
  return symbol !== 'xmr'
}

export const checkIsMemoRequired = (symbol: string): boolean => {
  return symbol === 'cspr'
}

export const checkIsFeeApproximate = (symbol: string, tokenChain?: string): boolean => {
  const provider = getProvider(symbol, tokenChain)

  return provider?.config?.isFeeApproximate || false
}

type TWalletBalanceRequestPayload = {
  address: string
  symbol: string
  chain?: string
  contractAddress?: string
  tokenSymbol?: string
  isFullBalance?: boolean
}

export const getBalances = async (
  wallets: TGetBalanceWalletProps[],
  options: TGetBalanceOptions = {}
): Promise<IGetBalances[] | null> => {
  if (wallets.length > 1) {
    setItem('enable_skeletons', 'true')
  }

  try {
    const mapWallets = wallets.map((wallet) => {
      const tokenSymbol = wallet.chain ? wallet.symbol : undefined
      const sharedToken = getSharedToken(wallet.symbol, wallet.chain)
      const contractAddress =
        wallet.contractAddress ||
        sharedToken?.address ||
        (wallet.chain ? getToken(wallet.symbol, wallet.chain)?.address : undefined)

      const requestPayload: TWalletBalanceRequestPayload = {
        symbol: wallet.symbol,
        address: wallet.address,
        contractAddress,
        chain: getWalletChain(wallet.symbol, wallet.chain) || wallet.chain,
        isFullBalance: wallet.isFullBalance,
      }

      requestPayload.tokenSymbol = contractAddress ? tokenSymbol : undefined

      return requestPayload
    })

    const data = await fetchBalances(mapWallets)

    if (!data?.length) {
      return data
    }

    for (const wallet of data) {
      const { balanceInfo, symbol, address } = wallet

      const savedData = getLatestBalance(address, symbol)

      const precision = getBalancePrecision(symbol)
      const balanceDiff = getBalanceDiff(savedData.balance, balanceInfo.balance || 0, precision)
      const isPendingStatusChanged = !!savedData.pending !== !!balanceInfo.pending
      const isBalanceChanged = balanceDiff || isPendingStatusChanged

      if (isBalanceChanged) {
        if (balanceDiff) {
          const wallet = getSingleWallet(address, symbol)
          if (wallet?.lastBalanceCheck) {
            logEvent({
              name: GENERAL_BALANCE_CHANGE,
              properties: {
                symbol,
                dynamics: balanceDiff > 0 ? 'pos' : 'neg',
              },
            })
          }
        }
      }
      if (getItem('initial_balances_request') && wallets.length > 1) {
        removeItem('initial_balances_request')
      }
      saveBalanceData({
        address,
        symbol,
        txHistoryUpdateRequired: Boolean(isBalanceChanged),
        ...balanceInfo,
      })
    }
    return data
  } catch {
    return []
  } finally {
    removeItem('enable_skeletons')
  }
}

export const getSingleBalance = async (wallet: TGetBalanceWalletProps): Promise<TBalanceData> => {
  const latestBalance = getLatestBalance(wallet.address, wallet.symbol)
  if (checkIfTimePassed(latestBalance.lastBalanceCheck || 0, { seconds: 30 })) {
    await getBalances([wallet])
  }
  return getLatestBalance(wallet.address, wallet.symbol)
}

export const activateWallet = async (
  chain: string,
  publicKey: string,
  privateKey?: string
): Promise<any | null> => {
  if (chain === 'xno') {
    if (!privateKey) {
      return null
    }

    return await nano.activateWallet(chain, publicKey, privateKey)
  }

  if (chain === 'hedera') {
    return await hedera.activateWallet(chain, publicKey)
  }
}

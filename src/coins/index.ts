import find from 'lodash/find'

// Coins
import * as bitcoinLike from '@coins/bitcoinLike'
import * as ethereumLike from '@coins/ethereumLike'
import * as cardano from '@coins/cardano'
import * as tron from '@coins/tron'
import * as theta from '@coins/theta'
import * as neo from '@coins/neo'
import * as nuls from '@coins/nuls'
import * as nerve from '@coins/nerve'
import * as xrp from '@coins/xrp'
import * as stellar from '@coins/stellar'
import * as harmony from '@coins/harmony'
import * as zilliqa from '@coins/zilliqa'
import * as tezos from '@coins/tezos'
import * as terra from '@coins/terra'
import * as waves from '@coins/waves'
import * as qtum from '@coins/qtum'
import * as near from '@coins/near'
import * as iota from '@coins/iota'
import * as neblio from '@coins/neblio'
import * as solana from '@coins/solana'
import * as polkadotLike from '@coins/polkadotLike'
import * as fioProtocol from '@coins/fioProtocol'
import * as elrond from '@coins/elrond'
import * as casper from '@coins/casper'
import * as aptos from '@coins/aptos'
import * as verge from '@coins/verge'
import * as toncoin from '@coins/toncoin'
import * as cosmosLike from '@coins/cosmosLike'
import * as hedera from '@coins/hedera'
import * as vechain from '@coins/vechain'
import * as digibyte from '@coins/digibyte'
import * as ravencoin from '@coins/ravencoin'
import * as nano from '@coins/nano'
import * as xinfin from '@coins/xinfin'
// import * as iotex from '@coins/iotex'
// import * as sxp from '@coins/sxp'
import * as icon from '@coins/icon'

// Utils
import { logErrorCreateTx, logErrorGenerateAddress, logErrorImportPrivateKey } from '@utils/metrics'
import { getEtherNetworkFee } from '@utils/api'
import { getCurrencyBalance } from './utils'

// Config
import { getCurrencyByChain } from '@config/currencies/utils'
import { NOT_ETH_NETWORKS, TNetwork } from '@config/networks'

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

const providers: TProvider[] = [
  bitcoinLike,
  ethereumLike,
  cardano,
  tron,
  theta,
  neo,
  nuls,
  nerve,
  xrp,
  stellar,
  harmony,
  zilliqa,
  tezos,
  terra,
  waves,
  qtum,
  near,
  iota,
  neblio,
  solana,
  polkadotLike,
  fioProtocol,
  elrond,
  casper,
  aptos,
  verge,
  toncoin,
  cosmosLike,
  hedera,
  vechain,
  digibyte,
  nano,
  ravencoin,
  xinfin,
  icon,
  // iotex,
  // sxp,
]

const getProvider = (symbol: string, tokenChain?: string): TProvider | null => {
  if (tokenChain) {
    if (tokenChain === 'terra-classic') {
      return terra
    }

    if (tokenChain === 'tron') {
      return tron
    }

    if (tokenChain === 'solana') {
      return solana
    }

    if (tokenChain === 'cardano') {
      return cardano
    }

    if (tokenChain === 'neo') {
      return neo
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
          utxos = bitcoinLike.getUtxos('doge', outputs, amount)
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
        const to = (await ethereumLike.generateAddress())?.address
        const value = decimals
          ? ethereumLike.convertDecimals(amount, decimals)
          : ethereumLike.toEther(amount)

        if (to) {
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
  if (bitcoinLike.config.coins.indexOf(symbol) !== -1) {
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
  if (tokenChain) {
    const currencyInfo = getCurrencyByChain(tokenChain)

    if (currencyInfo) {
      return [symbol, currencyInfo.symbol]
    }
  }

  if (theta.config.coins.indexOf(symbol) !== -1) {
    return theta.config.coins.sort(
      (a: string, b: string) => Number(b.indexOf(symbol) !== -1) - Number(a.indexOf(symbol) !== -1)
    )
  }

  if (vechain.config.coins.indexOf(symbol) !== -1) {
    return vechain.config.coins.sort(
      (a: string, b: string) => b.indexOf(symbol) - a.indexOf(symbol)
    )
  }

  return [symbol]
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (theta.config.coins.indexOf(symbol) !== -1) {
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

export const activateWallet = async (
  chain: string,
  publicKey: string,
  privateKey?: string
): Promise<string | null> => {
  if (chain === 'xno') {
    if (!privateKey) {
      return null
    }

    return await nano.activateWallet(chain, publicKey, privateKey)
  }

  if (chain === 'hedera') {
    return await hedera.activateWallet(chain, publicKey)
  }

  return null
}

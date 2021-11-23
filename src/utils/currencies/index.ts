// Config
import addressValidate from '@config/addressValidate'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Utils
import {
  getEtherNetworkFee,
  getThetaNetworkFee,
  getNetworkFee as getNetworkFeeRequest,
  getCustomFee,
} from '@utils/api'
import { TCustomFee } from '@utils/api/types'
import { toLower } from '@utils/format'

// Currencies
import * as ethereumLike from '@utils/currencies/ethereumLike'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'
import * as theta from '@utils/currencies/theta'
import * as cardano from '@utils/currencies/cardano'
import * as ripple from '@utils/currencies/ripple'
import * as neblio from '@utils/currencies/neblio'
import * as nuls from '@utils/currencies/nuls'
import * as nerve from '@utils/currencies/nerve'
import * as tron from '@utils/currencies/tron'
import * as hedera from '@utils/currencies/hedera'
import * as zilliqa from '@utils/currencies/zilliqa'
import * as verge from '@utils/currencies/verge'
import * as xinfin from '@utils/currencies/xinfin'
import * as solana from '@utils/currencies/solana'
import * as harmony from '@utils/currencies/harmony'
import * as vechain from '@utils/currencies/vechain'
import * as toncoin from '@utils/currencies/toncoin'

// Types
import { TProvider, TCreateTransactionProps, IGetFeeParams, TGetFeeData } from './types'

export const isEthereumLike = (symbol: string, chain?: string): boolean => {
  return ethereumLike.coins.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

const getProvider = (symbol: string): TProvider | null => {
  try {
    if (harmony.coins.indexOf(symbol) !== -1) {
      return harmony
    }

    if (tron.coins.indexOf(symbol) !== -1) {
      return tron
    }

    if (nerve.coins.indexOf(symbol) !== -1) {
      return nerve
    }

    if (nuls.coins.indexOf(symbol) !== -1) {
      return nuls
    }

    if (neblio.coins.indexOf(symbol) !== -1) {
      return neblio
    }

    if (ripple.coins.indexOf(symbol) !== -1) {
      return ripple
    }

    if (cardano.coins.indexOf(symbol) !== -1) {
      return cardano
    }

    if (theta.coins.indexOf(symbol) !== -1) {
      return theta
    }

    if (hedera.coins.indexOf(symbol) !== -1) {
      return hedera
    }

    if (zilliqa.coins.indexOf(symbol) !== -1) {
      return zilliqa
    }

    if (verge.coins.indexOf(symbol) !== -1) {
      return verge
    }

    if (xinfin.coins.indexOf(symbol) !== -1) {
      return xinfin
    }

    if (solana.coins.indexOf(symbol) !== -1) {
      return solana
    }

    if (vechain.coins.indexOf(symbol) !== -1) {
      return vechain
    }

    if (toncoin.coins.indexOf(symbol) !== -1) {
      return toncoin
    }

    return null
  } catch {
    return null
  }
}

export const generate = async (
  symbol: string,
  chain?: string
): Promise<TGenerateAddress | null> => {
  if (isEthereumLike(symbol, chain)) {
    return ethereumLike.generateAddress()
  }

  const provider = getProvider(symbol)

  if (provider?.generateWallet) {
    return await provider.generateWallet()
  }

  return bitcoinLike.generateWallet(symbol)
}

export const importPrivateKey = async (
  symbol: string,
  privateKey: string,
  chain?: string
): Promise<string | null> => {
  const provider = getProvider(symbol)

  if (provider?.importPrivateKey) {
    return await provider.importPrivateKey(privateKey)
  }

  if (isEthereumLike(symbol, chain)) {
    return ethereumLike.importPrivateKey(privateKey)
  } else {
    return bitcoinLike.importPrivateKey(privateKey, symbol)
  }
}

export const validateAddress = (symbol: string, address: string, tokenChain?: string): boolean => {
  try {
    const provider = getProvider(symbol)

    if (provider?.validateAddress) {
      return provider.validateAddress(address)
    }

    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return bitcoinLike.validateAddress(address, symbol)
    }

    return addressValidate(symbol, address, tokenChain)
  } catch {
    return false
  }
}

export const createTransaction = async ({
  from,
  to,
  amount,
  privateKey,
  symbol,
  tokenChain,
  outputs,
  networkFee,
  gas,
  chainId,
  gasPrice,
  nonce,
  contractAddress,
  xrpTxData,
  extraId,
}: TCreateTransactionProps): Promise<string | null> => {
  try {
    if (vechain.coins.indexOf(symbol) !== -1) {
      return await vechain.createTransaction(from, to, amount, privateKey, symbol)
    }

    if (nerve.coins.indexOf(symbol) !== -1) {
      return await nerve.createTransaction(from, to, amount, privateKey)
    }

    if (nuls.coins.indexOf(symbol) !== -1) {
      return await nuls.createTransaction(from, to, amount, privateKey)
    }

    if (ripple.coins.indexOf(symbol) !== -1 && xrpTxData) {
      return await ripple.createTransaction(from, to, amount, privateKey, xrpTxData, extraId)
    }

    if (cardano.coins.indexOf(symbol) !== -1 && outputs) {
      return await cardano.createTransaction(outputs, from, to, amount, privateKey)
    }
    if (isEthereumLike(symbol, tokenChain)) {
      const getContractAddress = contractAddress
        ? contractAddress
        : tokenChain
        ? getToken(symbol, tokenChain)?.address
        : undefined

      if (gas && chainId && gasPrice && typeof nonce === 'number') {
        if (tokenChain && getContractAddress) {
          return await ethereumLike.transferToken({
            value: amount,
            from,
            to,
            privateKey,
            gasPrice,
            gas,
            nonce,
            chainId,
            contractAddress: getContractAddress,
          })
        }
        return await ethereumLike.createTransaction(
          to,
          amount,
          gas,
          chainId,
          gasPrice,
          nonce,
          privateKey
        )
      }
      return null
    }

    if (outputs?.length && networkFee) {
      if (neblio.coins.indexOf(symbol) !== -1) {
        return neblio.createTransaction(outputs, to, amount, networkFee, from, privateKey)
      }

      return bitcoinLike.createTransaction(
        outputs,
        to,
        amount,
        networkFee,
        from,
        privateKey,
        symbol
      )
    }

    return null
  } catch {
    return null
  }
}

export const getNetworkFee = async ({
  symbol,
  addressFrom,
  addressTo,
  chain,
  amount,
  tokenChain,
  btcLikeParams,
  ethLikeParams,
}: IGetFeeParams): Promise<TGetFeeData | null> => {
  if (btcLikeParams) {
    const { outputs, customFee } = btcLikeParams

    if (cardano.coins.indexOf(symbol) !== -1) {
      return cardano.getNetworkFee(outputs, amount)
    }

    if (neblio.coins.indexOf(symbol) !== -1) {
      return neblio.getNetworkFee(addressFrom, outputs, amount)
    }

    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return bitcoinLike.getNetworkFee(addressFrom, outputs, amount, customFee, symbol)
    }
  }

  if (vechain.coins.indexOf(symbol) !== -1) {
    return await vechain.getNetworkFee(addressFrom, addressTo, amount, chain)
  }

  if (xinfin.coins.indexOf(symbol) !== -1) {
    return await xinfin.getNetworkFee()
  }

  if (toncoin.coins.indexOf(symbol) !== -1 && !tokenChain) {
    const networkFee = await toncoin.getNetworkFee(addressFrom, addressTo, +amount)

    return {
      networkFee,
    }
  }

  if (isEthereumLike(symbol, tokenChain)) {
    const { contractAddress, decimals } = ethLikeParams

    const value = decimals
      ? ethereumLike.convertDecimals(amount, decimals)
      : ethereumLike.toEther(amount)

    return await getEtherNetworkFee(
      addressFrom,
      addressTo,
      value,
      tokenChain || chain,
      tokenChain ? symbol : undefined,
      contractAddress,
      decimals
    )
  }

  if (theta.coins.indexOf(symbol) !== -1) {
    return await getThetaNetworkFee(addressFrom)
  }

  if (ripple.coins.indexOf(symbol) !== -1) {
    return await getNetworkFeeRequest('ripple')
  }

  if (harmony.coins.indexOf(symbol) !== -1) {
    return await getNetworkFeeRequest('harmony')
  }

  return null
}

export const formatUnit = (
  symbol: string,
  value: string | number,
  type: 'from' | 'to',
  chain?: string,
  unit?: string
): string | number => {
  try {
    const provider = getProvider(symbol)

    if (provider?.formatValue) {
      return provider.formatValue(value, type)
    }

    if (chain && bitcoinLike.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? bitcoinLike.fromSat(Number(value)) : bitcoinLike.toSat(Number(value))
    } else if (isEthereumLike(symbol, chain)) {
      if (unit) {
        return type === 'from'
          ? ethereumLike.fromEther(`${value}`)
          : ethereumLike.toEther(`${value}`)
      }
      return Number(value)
    }
    return 0
  } catch {
    return 0
  }
}

export const getExplorerLink = (
  address: string,
  symbol: string,
  chain: string,
  tokenChain?: string,
  contractAddress?: string
) => {
  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getExplorerLink(address, symbol, tokenChain, contractAddress)
  }

  const provider = getProvider(symbol)

  if (provider?.getExplorerLink) {
    return provider.getExplorerLink(address)
  }

  return `https://blockchair.com/${chain}/address/${address}`
}

export const getTransactionLink = (
  hash: string,
  symbol: string,
  chain: string,
  tokenChain?: string
): string => {
  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getTransactionLink(hash, chain, tokenChain)
  }

  const provider = getProvider(symbol)

  if (provider?.getTransactionLink) {
    return provider.getTransactionLink(hash)
  }

  return `https://blockchair.com/${chain}/transaction/${hash}`
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (theta.coins.indexOf(symbol) !== -1) {
      return 'tfuel'
    }
    if (vechain.coins.indexOf(symbol) !== -1) {
      return 'vtho'
    }
    if (tokenChain) {
      return getCurrencyByChain(tokenChain)?.symbol || symbol
    }
    return getCurrency(symbol)?.symbol || symbol
  } catch {
    return symbol
  }
}

export const importRecoveryPhrase = async (
  symbol: string,
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  try {
    const provider = getProvider(symbol)

    if (provider?.importRecoveryPhrase) {
      return provider.importRecoveryPhrase(recoveryPhrase)
    }

    return null
  } catch {
    return null
  }
}

export const getExtraIdName = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  return provider?.extraIdName || null
}

export const generateExtraId = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  if (provider?.generateExtraId) {
    return provider.generateExtraId()
  }
  return null
}

export const checkWithOutputs = (symbol: string): boolean => {
  try {
    const provider = getProvider(symbol)

    if (provider?.isWithOutputs || bitcoinLike.coins.indexOf(symbol) !== -1) {
      return true
    }
    return false
  } catch {
    return false
  }
}

export const getFee = async (symbol: string, chain: string): Promise<TCustomFee | null> => {
  try {
    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return await getCustomFee(chain)
    }
    return null
  } catch {
    return null
  }
}

export const getStandingFee = (symbol: string): number | null => {
  try {
    const provider = getProvider(symbol)

    if (provider?.getStandingFee) {
      return provider.getStandingFee()
    }

    if (toLower(symbol) === 'doge') {
      return 1
    }

    return null
  } catch {
    return null
  }
}

export const checkWithPhrase = (symbol: string, chain?: string): boolean => {
  if (!chain) {
    return cardano.coins.indexOf(symbol) !== -1 || toncoin.coins.indexOf(symbol) !== -1
  }

  return false
}

export const checkWithZeroFee = (symbol: string): boolean => {
  if (nerve.coins.indexOf(symbol) !== -1) {
    return true
  }

  return false
}

export const checkIsInternalTx = (symbol: string): boolean => {
  const provider = getProvider(symbol)

  if (provider?.isInternalTx) {
    return true
  }

  return false
}

export const createInternalTx = async (
  symbol: string,
  addressFrom: string,
  addressTo: string,
  amount: number,
  privateKey: string,
  networkFee: number,
  outputs?: UnspentOutput[],
  extraId?: string
): Promise<string | null> => {
  try {
    const provider = getProvider(symbol)

    if (provider?.createInternalTx) {
      return await provider.createInternalTx({
        symbol,
        addressFrom,
        addressTo,
        amount,
        privateKey,
        networkFee,
        outputs,
        extraId,
      })
    }

    return null
  } catch {
    return null
  }
}

export const getContractUrl = (address: string, chain: string): string => {
  if (chain === 'eth') {
    return `https://etherscan.io/address/${address}`
  }
  return `https://bscscan.com/address/${address}`
}

export const getTokenStandart = (chain?: string): string => {
  if (chain === 'bsc') {
    return 'BEP20'
  }

  return 'ERC20'
}

// Config
import addressValidate from '@config/addressValidate'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Utils
import {
  getEtherNetworkFee,
  getThetaNetworkFee,
  getNetworkFee,
  getFeePerByte,
  getCustomFee,
} from '@utils/api'
import { IGetNetworkFeeResponse, TCustomFee } from '@utils/api/types'
import { toLower } from '@utils/format'

// Currencies
import * as ethereumLike from '@utils/currencies/ethereumLike'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'
import * as theta from '@utils/currencies/theta'
import * as cardano from '@utils/currencies/cardano'
import * as ripple from '@utils/currencies/ripple'
import * as neblio from '@utils/currencies/neblio'
import * as nuls from '@utils/currencies/nuls'

// Types
import { TProvider, TCreateTransactionProps } from './types'

const web3Symbols = ['eth', 'etc', 'bnb']

export const isEthereumLike = (symbol: string, chain?: string): boolean => {
  return web3Symbols.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

const getProvider = (symbol: string): TProvider | null => {
  try {
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

    return null
  } catch {
    return null
  }
}

export const generate = (symbol: string, chain?: string): TGenerateAddress | null => {
  const provider = getProvider(symbol)

  if (provider?.generateWallet) {
    return provider.generateWallet()
  }

  if (isEthereumLike(symbol, chain)) {
    return ethereumLike.generateAddress()
  }

  return bitcoinLike.generateWallet(symbol)
}

export const importPrivateKey = (
  symbol: string,
  privateKey: string,
  chain?: string
): string | null => {
  const provider = getProvider(symbol)

  if (provider?.importPrivateKey) {
    return provider.importPrivateKey(privateKey)
  }

  if (isEthereumLike(symbol, chain)) {
    return ethereumLike.importPrivateKey(privateKey)
  } else {
    return bitcoinLike.importPrivateKey(privateKey, symbol)
  }
}

export const validateAddress = (
  symbol: string,
  chain: string,
  address: string,
  tokenChain?: string
): boolean => {
  try {
    const provider = getProvider(symbol)

    if (provider?.validateAddress) {
      return provider.validateAddress(address)
    }

    if (chain && bitcoinLike.coins.indexOf(chain) !== -1) {
      return bitcoinLike.validateAddress(address, symbol)
    }

    // @ts-ignore
    return new RegExp(tokenChain ? addressValidate.eth : addressValidate[symbol])?.test(address)
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
            value: `${amount}`,
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

interface IGetNetworkFeeParams {
  address: string
  symbol: string
  amount: string
  from: string
  to: string
  chain: string
  web3Params: {
    tokenChain?: string
    contractAddress?: string
    decimals?: number
  }
  outputs?: UnspentOutput[]
}

export const getNewNetworkFee = async (
  params: IGetNetworkFeeParams
): Promise<IGetNetworkFeeResponse | null> => {
  const { address, symbol, amount, from, to, chain, web3Params, outputs } = params

  if (nuls.coins.indexOf(symbol) !== -1) {
    return {
      networkFee: 0.001,
    }
  }

  if (
    web3Params?.contractAddress ||
    web3Params?.decimals ||
    web3Params?.tokenChain ||
    isEthereumLike(symbol)
  ) {
    const value = web3Params?.decimals
      ? ethereumLike.convertDecimals(amount, web3Params.decimals)
      : ethereumLike.toEther(amount)
    const web3Chain = web3Params?.tokenChain || chain
    const web3TokenChain = web3Params?.tokenChain ? symbol : undefined

    return await getEtherNetworkFee(
      from,
      to,
      value,
      web3Chain,
      web3TokenChain,
      web3Params?.contractAddress,
      web3Params?.decimals
    )
  }

  if (outputs?.length) {
    if (cardano.coins.indexOf(symbol) !== -1) {
      return cardano.getNetworkFee(outputs, amount)
    }
    if (neblio.coins.indexOf(symbol) !== -1) {
      return neblio.getNetworkFee(address, outputs, amount)
    }
    const btcFeePerByte = await getFeePerByte(chain)

    return bitcoinLike.getNetworkFee(address, outputs, amount, btcFeePerByte, symbol)
  }

  if (ripple.coins.indexOf(symbol) !== -1) {
    return await getNetworkFee('ripple')
  }

  if (theta.coins.indexOf(symbol) !== -1) {
    return await getThetaNetworkFee(address)
  }

  return null
}

export const getAddressNetworkFee = async (
  address: string,
  symbol: string,
  amount: string,
  from: string,
  to: string,
  chain: string,
  outputs?: UnspentOutput[],
  tokenChain?: string,
  contractAddress?: string,
  decimals?: number
): Promise<IGetNetworkFeeResponse | null> => {
  try {
    if (nuls.coins.indexOf(symbol) !== -1) {
      return {
        networkFee: 0.001,
      }
    }

    if (tokenChain || contractAddress || isEthereumLike(symbol, tokenChain)) {
      const value = decimals
        ? ethereumLike.convertDecimals(amount, decimals)
        : ethereumLike.toEther(amount)
      const data = await getEtherNetworkFee(
        from,
        to,
        value,
        tokenChain || chain,
        tokenChain ? symbol : undefined,
        contractAddress,
        decimals
      )

      return data
    }

    if (ripple.coins.indexOf(symbol) !== -1) {
      return await getNetworkFee('ripple')
    }

    if (theta.coins.indexOf(symbol) !== -1) {
      return await getThetaNetworkFee(address)
    }

    if (typeof outputs !== 'undefined') {
      if (cardano.coins.indexOf(symbol) !== -1) {
        return cardano.getNetworkFee(outputs, amount)
      }
      if (neblio.coins.indexOf(symbol) !== -1) {
        return neblio.getNetworkFee(address, outputs, amount)
      }

      const btcFeePerByte = await getFeePerByte(chain)

      return bitcoinLike.getNetworkFee(address, outputs, amount, btcFeePerByte, symbol)
    }

    return null
  } catch {
    return null
  }
}

export const formatUnit = (
  symbol: string,
  value: string | number,
  type: 'from' | 'to',
  chain?: string,
  unit?: string
): number => {
  try {
    if (nuls.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? nuls.fromNuls(value) : nuls.toNuls(value)
    } else if (neblio.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? neblio.fromSat(Number(value)) : neblio.toSat(Number(value))
    } else if (ripple.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? ripple.fromXrp(value) : ripple.toXrp(value)
    } else if (cardano.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? cardano.fromAda(value) : cardano.toAda(value)
    } else if (chain && bitcoinLike.coins.indexOf(chain) !== -1) {
      return type === 'from' ? bitcoinLike.fromSat(Number(value)) : bitcoinLike.toSat(Number(value))
    } else if (isEthereumLike(symbol, chain)) {
      if (unit) {
        return type === 'from'
          ? ethereumLike.fromEther(`${value}`)
          : ethereumLike.toEther(`${value}`)
      }
      return Number(value)
    } else if (theta.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? theta.fromTheta(value) : theta.toTheta(value)
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
  const provider = getProvider(symbol)

  if (provider?.getExplorerLink) {
    return provider.getExplorerLink(address)
  }

  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getExplorerLink(address, symbol, tokenChain, contractAddress)
  }

  return `https://blockchair.com/${chain}/address/${address}`
}

export const getTransactionLink = (
  hash: string,
  symbol: string,
  chain: string,
  tokenChain?: string
): string => {
  const provider = getProvider(symbol)

  if (provider?.getTransactionLink) {
    return provider.getTransactionLink(hash)
  }

  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getTransactionLink(hash, chain, tokenChain)
  } else {
    return `https://blockchair.com/${chain}/transaction/${hash}`
  }
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (theta.coins.indexOf(symbol) !== -1) {
      return 'tfuel'
    } else if (tokenChain) {
      return getCurrencyByChain(tokenChain)?.symbol || symbol
    }
    return getCurrency(symbol)?.symbol || symbol
  } catch {
    return symbol
  }
}

export const importRecoveryPhrase = (
  symbol: string,
  recoveryPhrase: string
): TGenerateAddress | null => {
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
  if (ripple.coins.indexOf(symbol) !== -1) {
    return ripple.extraIdName
  }
  return null
}

export const generateExtraId = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  if (provider?.generateExtraId) {
    return provider.generateExtraId()
  }
  return null
}

export const checkWithOuputs = (chain: string, symbol: string): boolean => {
  try {
    if (
      bitcoinLike.coins.indexOf(chain) !== -1 ||
      toLower(symbol) === 'ada' ||
      toLower(symbol) === 'nebl'
    ) {
      return true
    }
    return false
  } catch {
    return false
  }
}

export const getFee = async (
  symbol: string,
  chain: string,
  tokenChain?: string
): Promise<TCustomFee | null> => {
  try {
    if (bitcoinLike.coins.indexOf(chain) !== -1 || isEthereumLike(symbol, tokenChain)) {
      return await getCustomFee(chain)
    }
    return null
  } catch {
    return null
  }
}

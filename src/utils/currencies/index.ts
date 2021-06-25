import * as Nuls from '@utils/currencies/nuls'
import * as Ripple from '@utils/currencies/ripple'
import * as Cardano from '@utils/currencies/cardano'
import * as Theta from '@utils/currencies/theta'
import * as BitcoinLike from '@utils/currencies/bitcoinLike'
import * as EthereumLike from '@utils/currencies/ethereumLike'

// Config
import addressValidate from '@config/addressValidate'
import { getCurrency, getCurrencyByChain, ICurrency } from '@config/currencies'
import { getToken, IToken } from '@config/tokens'

// Utils
import {
  getEtherNetworkFee,
  IGetNetworkFeeResponse,
  getThetaNetworkFee,
  getNetworkFee,
} from '@utils/api'
import { toLower } from '@utils/format'

// Types
import { TCreateTransactionProps, TGetNetworkFeeParams } from './types'
import { TUnit } from './ethereumLike/types'

interface IProvider {
  coins: string[]
  generateWallet: (symbol: string, chain?: string) => TGenerateAddress | null
  importPrivateKey?: (privateKey: string, symbol: string) => string | null
  importRecoveryPhrase?: (recoveryPhrase: string) => TGenerateAddress | null
  validateAddress?: (address: string, symbol: string) => boolean
}

export const isEthereumLike = (symbol: TSymbols | string, chain?: string): boolean => {
  return EthereumLike.coins.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

const getProvider = (symbol: string, chain?: string): IProvider => {
  if (Nuls.coins.indexOf(symbol) !== -1) {
    return Nuls
  }

  if (Ripple.coins.indexOf(symbol) !== -1) {
    return Ripple
  }

  if (Cardano.coins.indexOf(symbol) !== -1) {
    return Cardano
  }

  if (Theta.coins.indexOf(symbol) !== -1) {
    return Theta
  }

  if (isEthereumLike(symbol, chain)) {
    return EthereumLike
  }

  return BitcoinLike
}

export const generateWallet = (symbol: string, chain?: string): TGenerateAddress | null => {
  const provider = getProvider(symbol, chain)

  if (provider) {
    return provider.generateWallet(symbol)
  }

  return null
}

export const importPrivateKey = (
  symbol: string,
  privateKey: string,
  chain?: string
): string | null => {
  const provider = getProvider(symbol, chain)

  if (provider?.importPrivateKey) {
    return provider.importPrivateKey(privateKey, symbol)
  }

  return null
}

export const validateAddress = (
  symbol: string,
  chain: string,
  address: string,
  tokenChain?: string
): boolean => {
  try {
    if (Ripple.coins.indexOf(symbol) !== -1) {
      return Ripple.validateAddress(address)
    }

    if (Nuls.coins.indexOf(symbol) !== -1) {
      return Nuls.validateAddress(address)
    }

    if (Cardano.coins.indexOf(symbol) !== -1) {
      return Cardano.validateAddress(address)
    }

    if (chain && BitcoinLike.chains.indexOf(chain) !== -1) {
      return BitcoinLike.validateAddress(address, symbol)
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
    if (Nuls.coins.indexOf(symbol) !== -1) {
      return await Nuls.createTransaction(from, to, amount, privateKey)
    }
    if (Ripple.coins.indexOf(symbol) !== -1 && xrpTxData) {
      return await Ripple.createTransaction(from, to, amount, privateKey, xrpTxData, extraId)
    }
    if (Cardano.coins.indexOf(symbol) !== -1 && outputs) {
      return await Cardano.createTransaction(outputs, from, to, amount, privateKey)
    }
    if (isEthereumLike(symbol, tokenChain)) {
      const getContractAddress = contractAddress
        ? contractAddress
        : tokenChain
        ? getToken(symbol, tokenChain)?.address
        : undefined

      if (gas && chainId && gasPrice && typeof nonce === 'number') {
        if (tokenChain && getContractAddress) {
          return await EthereumLike.transferToken({
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
        return await EthereumLike.createTransaction(
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
      return BitcoinLike.createTransaction(
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

export const getNewNetworkFee = async (
  params: TGetNetworkFeeParams
): Promise<IGetNetworkFeeResponse | null> => {
  const { address, symbol, amount, from, to, chain, web3Params, outputs } = params

  if (Nuls.coins.indexOf(symbol) !== -1) {
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
      ? EthereumLike.convertDecimals(amount, web3Params.decimals)
      : EthereumLike.toWei(amount, 'ether')
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
    return BitcoinLike.getNetworkFee(address, outputs, amount, symbol)
  }

  if (Theta.coins.indexOf(symbol) !== -1) {
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
    if (Nuls.coins.indexOf(symbol) !== -1) {
      return {
        networkFee: 0.001,
      }
    }
    if (tokenChain || contractAddress || isEthereumLike(symbol, tokenChain)) {
      const value = decimals
        ? EthereumLike.convertDecimals(amount, decimals)
        : EthereumLike.toWei(amount, 'ether')
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

    if (Ripple.coins.indexOf(symbol) !== -1) {
      return await getNetworkFee('ripple')
    }

    if (Theta.coins.indexOf(symbol) !== -1) {
      return await getThetaNetworkFee(address)
    }

    if (typeof outputs !== 'undefined') {
      if (toLower(symbol) === 'ada') {
        return Cardano.getNetworkFee(outputs, amount)
      }
      return BitcoinLike.getNetworkFee(address, outputs, amount, symbol)
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
  unit?: TUnit
): number => {
  try {
    if (Nuls.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? Nuls.fromNuls(value) : Nuls.toNuls(value)
    } else if (Ripple.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? Ripple.fromXrp(value) : Ripple.toXrp(value)
    } else if (Cardano.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? Cardano.fromAda(value) : Cardano.toAda(value)
    } else if (chain && BitcoinLike.chains.indexOf(chain) !== -1) {
      return type === 'from' ? BitcoinLike.fromSat(Number(value)) : BitcoinLike.toSat(Number(value))
    } else if (isEthereumLike(symbol, chain)) {
      if (unit) {
        return type === 'from'
          ? EthereumLike.fromWei(`${value}`, unit)
          : EthereumLike.toWei(`${value}`, unit)
      }
      return Number(value)
    } else if (Theta.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? Theta.fromTheta(value) : Theta.toTheta(value)
    }

    return 0
  } catch {
    return 0
  }
}

export const getExplorerLink = (
  address: string,
  symbol: string,
  currency?: ICurrency | IToken,
  chain?: string,
  contractAddress?: string
) => {
  if (Nuls.coins.indexOf(symbol) !== -1) {
    return Nuls.getExplorerLink(address)
  } else if (Ripple.coins.indexOf(symbol) !== -1) {
    return Ripple.getExplorerLink(address)
  } else if (Cardano.coins.indexOf(symbol) !== -1) {
    return Cardano.getExplorerLink(address)
  } else if (Theta.coins.indexOf(symbol) !== -1) {
    return `https://explorer.thetatoken.org/account/${address}`
  } else if (isEthereumLike(symbol, chain)) {
    const parseSymbol = toLower(symbol)

    if (chain) {
      const parseChain = toLower(chain)
      const tokenInfo = getToken(symbol, chain)
      const tokenAddress = tokenInfo?.address || contractAddress

      if (parseChain === 'eth') {
        return `https://etherscan.io/token/${tokenAddress}?a=${address}`
      } else if (parseChain === 'bsc') {
        ;`https://bscscan.com/token/${tokenAddress}?a=${address}`
      }
    } else {
      if (parseSymbol === 'eth') {
        return `https://etherscan.io/address/${address}`
      } else if (parseSymbol === 'bnb') {
        return `https://bscscan.com/address/${address}`
      } else if (parseSymbol === 'etc') {
        return `https://blockscout.com/etc/mainnet/address/${address}/transactions`
      }
    }
  }
  return `https://blockchair.com/${currency?.chain}/address/${address}`
}

export const getTransactionLink = (
  hash: string,
  symbol: string,
  chain: string,
  tokenChain?: string
): string | null => {
  if (Nuls.coins.indexOf(symbol) !== -1) {
    return Nuls.getTransactionLink(hash)
  } else if (Ripple.coins.indexOf(symbol) !== -1) {
    return Ripple.getTransactionLink(hash)
  } else if (Cardano.coins.indexOf(symbol) !== -1) {
    return Cardano.getTransactionLink(hash)
  } else if (isEthereumLike(symbol, tokenChain)) {
    const parseChain = tokenChain ? toLower(tokenChain) : toLower(chain)

    if (parseChain === 'eth') {
      return `https://etherscan.io/tx/${hash}`
    } else if (parseChain === 'bsc') {
      return `https://bscscan.com/tx/${hash}`
    } else if (parseChain === 'etc') {
      return `https://blockscout.com/etc/mainnet/tx/${hash}/internal-transactions`
    }
    return null
  } else {
    return `https://blockchair.com/${chain}/transaction/${hash}`
  }
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (Theta.coins.indexOf(symbol) !== -1) {
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
    if (Cardano.coins.indexOf(symbol) !== -1) {
      return Cardano.importRecoveryPhrase(recoveryPhrase)
    }
    return null
  } catch {
    return null
  }
}

export const getExtraIdName = (symbol: string): null | string => {
  if (Ripple.coins.indexOf(symbol) !== -1) {
    return Ripple.extraIdName
  }
  return null
}

export const generateExtraId = (symbol: string): null | string => {
  if (Ripple.coins.indexOf(symbol) !== -1) {
    return Ripple.generateTag()
  }
  return null
}

import Web3 from 'web3'
import { TransactionConfig } from 'web3-core'

// Utils
import { getTxParams } from '@utils/api'
import { toLower } from '@utils/format'

// Config
import contractABI from '@config/contractABI'
import ethereumLikeCoins from '@config/currencies/ethereumLike'
import chains from './chains'

// Tokens
import { getToken } from '@tokens/index'

// Types
import { TGenerateAddress, TCreateTxProps, TCurrencyConfig } from '@coins/types'
import { TChain } from './types'

const web3 = new Web3()

export const config: TCurrencyConfig = {
  coins: ethereumLikeCoins.map((coin) => coin.symbol),
}

const getChainInfo = (chain: string): TChain | undefined => {
  return chains.find((item: TChain) => toLower(item.chain) === toLower(chain))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const item = web3.eth.accounts.create()

  return {
    privateKey: item.privateKey,
    address: item.address,
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  return web3.eth.accounts.privateKeyToAccount(privateKey).address
}

export const getExplorerLink = (
  address: string,
  chain: string,
  tokenChain?: string,
  contractAddress?: string,
  symbol?: string
): string => {
  const getChain = getChainInfo(chain)

  if (getChain) {
    const { explorerLink, tokenExplorerLink } = getChain

    const tokenInfo = symbol && tokenChain ? getToken(symbol, tokenChain) : undefined
    const tokenAddress = tokenInfo?.address || contractAddress

    if (tokenAddress) {
      return tokenExplorerLink.replace('CA', tokenAddress).replace('ADDR', address)
    }

    return explorerLink.replace('ADDR', address)
  }

  return ''
}

export const getTransactionLink = (hash: string, chain: string): string => {
  const getChain = getChainInfo(chain)

  if (getChain) {
    return getChain.txLink.replace('HASH', hash)
  }

  return ''
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
}

export const fromEther = (value: string | number): string => {
  return web3.utils.fromWei(`${value}`, 'ether')
}

export const toEther = (value: string | number): string => {
  return web3.utils.toWei(`${value}`, 'ether')
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +fromEther(value)
  }

  return +toEther(value)
}

const signTransaction = async (
  transactionConfig: TransactionConfig,
  privateKey: string
): Promise<string | null> => {
  const { rawTransaction } = await web3.eth.accounts.signTransaction(transactionConfig, privateKey)

  return rawTransaction || null
}

export const createTx = async ({
  chain,
  addressFrom,
  addressTo,
  amount,
  privateKey,
  tokenChain,
  contractAddress,
  symbol,
  decimals,
}: TCreateTxProps): Promise<string | null> => {
  if (!privateKey) {
    return null
  }

  const value = decimals ? convertDecimals(amount, decimals) : toEther(amount)

  const params = await getTxParams(
    'eth-like',
    addressFrom,
    addressTo,
    value,
    chain || tokenChain,
    contractAddress
  )

  if (params) {
    const { chainId, nonce, gas, gasPrice } = params

    if (tokenChain) {
      const getContractAddress = contractAddress
        ? contractAddress
        : tokenChain
        ? getToken(symbol, tokenChain)?.address
        : undefined

      if (getContractAddress) {
        const contract = new web3.eth.Contract(contractABI, getContractAddress, {
          from: addressFrom,
        })
        const data = contract.methods.transfer(addressTo, value)

        return await signTransaction(
          {
            to: getContractAddress,
            gasPrice,
            gas,
            data: data.encodeABI(),
            nonce,
            chainId,
          },
          privateKey
        )
      }
    }

    return await signTransaction(
      {
        to: addressTo,
        value,
        gas,
        chainId,
        gasPrice,
        nonce,
      },
      privateKey
    )
  }
  return null
}

export const convertDecimals = (value: string | number, decimals: number): string => {
  return web3.utils
    .toBN(toEther(`${value}`))
    .div(
      web3.utils.toBN(
        `1${Array(18 - decimals)
          .fill(0)
          .join()
          .replace(/,/g, '')}`
      )
    )
    .toString()
}

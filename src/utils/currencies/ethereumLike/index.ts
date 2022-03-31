import Web3 from 'web3'

// Config
import contractABI from '@config/contractABI'
import { getToken } from '@config/tokens'

// Utils
import { toLower } from '@utils/format'

// Types
import { TransferTokenOptions } from './types'

const web3 = new Web3()

export const coins: string[] = ['eth', 'etc', 'bnb', 'matic', 'ftm']

export const toHex = (value: number): string => {
  return web3.utils.toHex(value)
}

export const generateAddress = (): TGenerateAddress | null => {
  try {
    const item = web3.eth.accounts.create()

    return {
      privateKey: item.privateKey,
      address: item.address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey).address
  } catch {
    return null
  }
}

export const fromEther = (value: string | number): string => {
  return web3.utils.fromWei(`${value}`, 'ether')
}

export const toEther = (value: string | number): string => {
  return web3.utils.toWei(`${value}`, 'ether')
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

export const createTransaction = async (
  to: string,
  value: string,
  gas: number,
  chainId: number,
  gasPrice: string,
  nonce: number,
  privateKey: string
): Promise<string | null> => {
  try {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(
      {
        to,
        value,
        gas,
        chainId,
        gasPrice,
        nonce,
      },
      privateKey
    )

    return rawTransaction || null
  } catch {
    return null
  }
}

export const transferToken = async ({
  value,
  from,
  to,
  privateKey,
  gasPrice,
  gas,
  nonce,
  chainId,
  contractAddress,
}: TransferTokenOptions): Promise<string | null> => {
  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress, { from })
    const data = contract.methods.transfer(to, value)

    const { rawTransaction } = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        gasPrice,
        gas,
        data: data.encodeABI(),
        nonce,
        chainId,
      },
      privateKey
    )

    if (rawTransaction) {
      return rawTransaction
    }

    return null
  } catch {
    return null
  }
}

export const getExplorerLink = (
  address: string,
  symbol: string,
  tokenChain?: string,
  contractAddress?: string
): string => {
  const parseSymbol = toLower(symbol)

  if (tokenChain) {
    const parseChain = toLower(tokenChain)
    const tokenInfo = getToken(symbol, tokenChain)
    const tokenAddress = tokenInfo?.address || contractAddress

    if (parseChain === 'eth') {
      return `https://etherscan.io/token/${tokenAddress}?a=${address}`
    }

    if (parseChain === 'matic') {
      return `https://polygonscan.com/token/${tokenAddress}?a=${address}`
    }

    if (parseChain === 'ftm') {
      return `https://ftmscan.com/token/${tokenAddress}?a=${address}`
    }

    return `https://bscscan.com/token/${tokenAddress}?a=${address}`

  } else {
    if (parseSymbol === 'eth') {
      return `https://etherscan.io/address/${address}`
    } else if (parseSymbol === 'bnb') {
      return `https://bscscan.com/address/${address}`
    } else if (parseSymbol === 'matic') {
      return `https://polygonscan.com/address/${address}`
    } else if (parseSymbol === 'ftm') {
      return `https://ftmscan.com/address/${address}`
    }
    return `https://blockscout.com/etc/mainnet/address/${address}/transactions`
  }
}

export const getTransactionLink = (hash: string, chain: string, tokenChain?: string): string => {
  const parseChain = tokenChain ? toLower(tokenChain) : toLower(chain)

  if (parseChain === 'eth') {
    return `https://etherscan.io/tx/${hash}`
  } else if (parseChain === 'bsc') {
    return `https://bscscan.com/tx/${hash}`
  } else if (parseChain === 'matic') {
    return `https://polygonscan.com/tx/${hash}`
  } else if (parseChain === 'ftm') {
    return `https://ftmscan.com/tx/${hash}`
  }

  return `https://blockscout.com/etc/mainnet/tx/${hash}/internal-transactions`
}

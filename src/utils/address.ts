import * as web3 from '@utils/web3'
import bitcoinLike from '@utils/bitcoinLike'

// Config
import addressValidate from '@config/addressValidate'
import { ICurrency } from '@config/currencies'
import { getToken, IToken } from '@config/tokens'

// Utils
import { getEtherNetworkFee, IGetNetworkFeeResponse } from '@utils/api'
import { toLower } from './format'

const web3Symbols = ['eth', 'etc', 'bnb']

type TCreateTransactionProps = {
  from: string
  to: string
  amount: number
  privateKey: string
  symbol: string
  tokenChain?: string
  outputs?: UnspentOutput[]
  networkFee?: number
  gas?: number
  chainId?: number
  gasPrice?: string
  nonce?: number
  contractAddress?: string
}

export const isEthereumLike = (symbol: TSymbols | string, chain?: string): boolean => {
  return web3Symbols.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

export const generate = (symbol: TSymbols | string, chain?: string): TGenerateAddress | null => {
  if (isEthereumLike(symbol, chain)) {
    return web3.generateAddress()
  } else {
    const generateBTCLikeAddress = new bitcoinLike(symbol).generate()

    return generateBTCLikeAddress
  }
}

export const importPrivateKey = (
  symbol: TSymbols | string,
  privateKey: string,
  chain?: string
): string | null => {
  if (isEthereumLike(symbol, chain)) {
    return web3.importPrivateKey(privateKey)
  } else {
    const importBTCLikePrivateKey = new bitcoinLike(symbol).import(privateKey)
    return importBTCLikePrivateKey
  }
}

export const validateAddress = (
  symbol: TSymbols | string,
  address: string,
  chain?: string
): boolean => {
  // @ts-ignore
  const findRegexp = chain ? addressValidate.eth : addressValidate[symbol]
  return new RegExp(findRegexp)?.test(address)
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
}: TCreateTransactionProps): Promise<TCreatedTransaction | null> => {
  try {
    if (isEthereumLike(symbol, tokenChain)) {
      const getContractAddress = contractAddress
        ? contractAddress
        : tokenChain
        ? getToken(symbol, tokenChain)?.address
        : undefined

      if (gas && chainId && gasPrice && typeof nonce === 'number') {
        if (tokenChain && getContractAddress) {
          return await web3.transferToken({
            value: `${amount}`,
            chain: tokenChain,
            symbol,
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
        return await web3.createTransaction(to, amount, gas, chainId, gasPrice, nonce, privateKey)
      }
      return null
    }

    if (outputs?.length && networkFee) {
      return new bitcoinLike(symbol).createTransaction(
        outputs,
        to,
        amount,
        networkFee,
        from,
        privateKey
      )
    }

    return null
  } catch {
    return null
  }
}

interface IFetNetworkFeeParams {
  symbol: string
  amount: string
  from: string
  to: string
  chain: string
  web3Params?: {
    tokenChain: string
    contractAddress: string
    decimals: number
  }
  outputs?: UnspentOutput[]
  fee?: number
}

export const getNewNetworkFee = async (
  params: IFetNetworkFeeParams
): Promise<IGetNetworkFeeResponse | null> => {
  const { symbol, amount, from, to, chain, web3Params, outputs, fee } = params

  if (web3Params || isEthereumLike(symbol)) {
    const value = web3Params?.decimals
      ? web3.convertDecimals(amount, web3Params.decimals)
      : web3.toWei(amount, 'ether')
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

  if (outputs?.length && fee) {
    return new bitcoinLike(symbol).getNetworkFee(outputs, fee, amount)
  }

  return null
}

export const getAddressNetworkFee = async (
  symbol: string,
  fee: number,
  amount: string,
  from: string,
  to: string,
  chain: string,
  outputs?: UnspentOutput[],
  tokenChain?: string,
  contractAddress?: string,
  decimals?: number
): Promise<IGetNetworkFeeResponse | null> => {
  if (tokenChain || contractAddress || isEthereumLike(symbol, tokenChain)) {
    const value = decimals ? web3.convertDecimals(amount, decimals) : web3.toWei(amount, 'ether')
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

  if (outputs?.length) {
    return new bitcoinLike(symbol).getNetworkFee(outputs, fee, amount)
  }

  return null
}

export const formatUnit = (
  symbol: string,
  value: string | number,
  type: 'from' | 'to',
  chain?: string,
  unit?: web3.Unit
): number => {
  if (isEthereumLike(symbol, chain)) {
    if (unit) {
      return type === 'from' ? web3.fromWei(`${value}`, unit) : web3.toWei(`${value}`, unit)
    }
    return Number(value)
  }
  return type === 'from'
    ? new bitcoinLike(symbol).fromSat(Number(value))
    : new bitcoinLike(symbol).toSat(Number(value))
}

export const getExplorerLink = (
  address: string,
  symbol: string,
  currency?: ICurrency | IToken,
  chain?: string,
  contractAddress?: string
) => {
  if (isEthereumLike(symbol, chain)) {
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
  if (isEthereumLike(symbol, tokenChain)) {
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

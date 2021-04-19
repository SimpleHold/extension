import * as web3 from '@utils/web3'
import bitcoinLike from '@utils/bitcoinLike'

// Config
import addressValidate from '@config/addressValidate'
import { getWeb3TxParams } from '@utils/api'

const web3Symbols = ['eth', 'etc', 'bnb']

type TGetNetworkFeeResponse = {
  networkFee?: number
  networkFeeLabel?: string
  utxos: UnspentOutput[]
  chainId?: number
  gas?: number
  gasPrice?: string
  nonce?: number
}

export const isEthereumLike = (symbol: TSymbols, chain?: string): boolean => {
  return web3Symbols.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

export const generate = (symbol: TSymbols, chain?: string): TGenerateAddress | null => {
  if (isEthereumLike(symbol, chain)) {
    return web3.generateAddress()
  } else {
    const generateBTCLikeAddress = new bitcoinLike(symbol).generate()

    return generateBTCLikeAddress
  }
}

export const importPrivateKey = (
  symbol: TSymbols,
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

export const validateAddress = (symbol: TSymbols, address: string): boolean => {
  return new RegExp(addressValidate[symbol])?.test(address)
}

export const createTransaction = async (
  from: string,
  to: string,
  amount: number,
  privateKey: string,
  symbol: TSymbols,
  chain?: string,
  outputs?: UnspentOutput[],
  networkFee?: number,
  gas?: number,
  chainId?: number,
  gasPrice?: string,
  nonce?: number
): Promise<TCreatedTransaction | null> => {
  if (isEthereumLike(symbol, chain)) {
    if (gas && chainId && gasPrice && nonce) {
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
}

export const getAddressNetworkFee = async (
  symbol: TSymbols,
  outputs: UnspentOutput[],
  fee: number,
  amount: string,
  from: string,
  to: string,
  chain?: string
): Promise<TGetNetworkFeeResponse | null> => {
  if (chain && isEthereumLike(symbol, chain)) {
    const value = web3.toWei(amount, 'ether')
    const params = await getWeb3TxParams(from, to, value, chain)

    return {
      networkFee: params?.gas,
      networkFeeLabel: 'wei',
      utxos: [],
      ...params,
    }
  }
  return new bitcoinLike(symbol).getNetworkFee(outputs, fee, amount)
}

export const formatUnit = (
  symbol: TSymbols,
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

import * as web3 from '@utils/web3'
import bitcoinLike from '@utils/bitcoinLike'

// Config
import addressValidate from '@config/addressValidate'

const web3Symbols = ['eth', 'etc', 'bnb']

const isEthereumLike = (symbol: TSymbols, chain?: string): boolean => {
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
  networkFee?: number
): Promise<TCreatedTransaction | null> => {
  if (isEthereumLike(symbol, chain)) {
    return await web3.createTransaction(from, to, amount, privateKey)
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

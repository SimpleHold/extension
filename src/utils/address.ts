import * as web3 from '@utils/web3'
import bitcoinLike from '@utils/bitcoinLike'

const web3Symbols = ['eth', 'etc', 'bnb']

export const generate = (symbol: TSymbols, platform?: string): TGenerateAddress | null => {
  if (web3Symbols.indexOf(symbol) !== -1 || platform) {
    return web3.generateAddress()
  } else {
    const generateBTCLikeAddress = new bitcoinLike(symbol).generate()

    return generateBTCLikeAddress
  }
}

export const importPrivateKey = (
  symbol: TSymbols,
  privateKey: string,
  platform?: string
): string | null => {
  if (web3Symbols.indexOf(symbol) !== -1 || platform) {
    return web3.importPrivateKey(privateKey)
  } else {
    const importBTCLikePrivateKey = new bitcoinLike(symbol).import(privateKey)
    return importBTCLikePrivateKey
  }
}

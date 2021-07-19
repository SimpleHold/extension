declare module '*.png'
declare module '*.svg'
declare module '@thetalabs/theta-js'

type TGenerateAddress = {
  address: string
  privateKey: string
  mnemonic?: string
}

type TCreatedTransaction = {
  raw: string
  hash: string
}

interface Window {
  dashcore: {
    generateWallet: () => TGenerateAddress
  }
}

interface UnspentOutput {
  txId: string
  outputIndex: number
  script: string
  satoshis: number
  address: string
}

interface BitcoinLikeProvider {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  toSat: (value: number) => number
  fromSat: (value: number) => number
  createTransaction: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ) => TCreatedTransaction
  getFee: (outputs: UnspentOutput[], to: string, amount: number, changeAddress: string) => number
  isAddressValid: (address: string) => boolean
  createUnsignedTx: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string
  ) => string
}

declare const bitcoin: BitcoinLikeProvider
declare const bitcoincash: BitcoinLikeProvider
declare const dash: BitcoinLikeProvider
declare const litecoin: BitcoinLikeProvider
declare const dogecoin: BitcoinLikeProvider

type TSymbols =
  | 'btc'
  | 'bch'
  | 'bsv'
  | 'ltc'
  | 'doge'
  | 'dash'
  | 'eth'
  | 'etc'
  | 'bsc'
  | 'bnb'
  | 'theta'
  | 'tfuel'
  | 'ada'
  | 'xrp'

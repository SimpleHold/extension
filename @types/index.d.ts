declare module '*.png'
declare module '*.svg'

type TGenerateAddress = {
  address: string
  privateKey: string
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

declare const bitcoin: {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  getTransactionSize: (outputs: UnspentOutput[]) => number
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
}

declare const bitcoincash: {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  getTransactionSize: (outputs: UnspentOutput[]) => number
  createTransaction: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ) => TCreatedTransaction | null
}

declare const dash: {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  getTransactionSize: (outputs: UnspentOutput[]) => number
  createTransaction: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ) => TCreatedTransaction
}

declare const litecoin: {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  getTransactionSize: (outputs: UnspentOutput[]) => number
  createTransaction: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ) => TCreatedTransaction | null
}

declare const dogecoin: {
  generateWallet: () => TGenerateAddress
  importPrivateKey: (privateKey: string) => string
  getTransactionSize: (outputs: UnspentOutput[]) => number
  createTransaction: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ) => TCreatedTransaction | null
}

type TSymbols = 'btc' | 'bch' | 'bsv' | 'ltc' | 'doge' | 'dash' | 'eth' | 'etc' | 'bsc'

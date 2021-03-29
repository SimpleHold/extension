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
}

declare const bitcoinsv: {
  generateWallet: () => TGenerateAddress
}

declare const litecoin: {
  generateWallet: () => TGenerateAddress
}

declare const dogecoin: {
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

declare const bitgo: {
  zcash: {
    generateWallet: () => TGenerateAddress
  }
  groestl: {
    generateWallet: () => TGenerateAddress
  }
}

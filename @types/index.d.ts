declare module '*.png'
declare module '*.svg'
declare module '@thetalabs/theta-js'
declare module 'neblio-lib'

declare module 'nuls-sdk-js' {
  function newAddress(
    chainId: number,
    passWord: string,
    prefix: string
  ): {
    address: string
    pri: string
  }
  function importByKey(
    chainId: number,
    pri: string,
    passWord: string,
    prefix: string
  ): {
    address: string
    pub: string
    pri: string
  }
  function verifyAddress(
    address: string
  ): {
    chainId: number
    right: boolean
  }
  function transactionAssemble(inputs: any, outputs: any, remark: string, type: number): any
  function transactionSerialize(pri: string, pub: string, assembleTx: any): string
}

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

interface CardanoUnspentTxOutput {
  ctaAddress: string
  ctaAmount: {
    getCoin: string
  }
  ctaTxHash: string
  ctaTxIndex: number
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
  getFee: (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    changeAddress: string,
    feePerByte: number
  ) => number
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

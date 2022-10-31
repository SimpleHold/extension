declare module '*.png'
declare module '*.svg'
declare module 'tonweb'
declare module 'tonweb-mnemonic'
declare module 'digibyte-lib'

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

declare const ravencoin: BitcoinLikeProvider
declare const ravencore: any

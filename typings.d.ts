declare module '*.png'
declare module '*.svg'

declare module 'cardano-crypto.js'
declare module 'borc'
declare module '@thetalabs/theta-js'
declare module 'tronweb'
declare module 'nuls-sdk-js'
declare module 'nerve-sdk-js'
declare module 'neblio-lib'
declare module 'bitcore-lib-cash'
declare module 'bsv'
declare module '@fioprotocol/fiosdk'
declare module '@fioprotocol/fiosdk/lib/transactions/Transactions'
declare module '@cityofzion/neon-js'
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

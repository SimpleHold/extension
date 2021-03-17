declare module '*.png'
declare module '*.svg'
declare module 'litecore-lib'
declare module '@dashevo/dashcore-lib'
declare module 'bitcore-lib-doge'
declare module 'bitcore-lib-cash'
declare module 'bitgo-utxo-lib'

interface Window {
  createTransaction: any
  btcToSat: (amount: number) => number
  importAddress: (privateKey: string) => string | null
  getTransactionSize: (outputs: any[]) => number
  satToBtc: (amount: number) => number
  generateWallet: () => {
    address: string
    privateKey: string
  }
  dashcore: any
}

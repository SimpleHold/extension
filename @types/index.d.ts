declare module '*.png'
declare module '*.svg'

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
}

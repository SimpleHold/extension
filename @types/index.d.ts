declare module '*.png'
declare module '*.svg'

interface MyWindow extends Window {
  createTransaction(): void
}

declare var window: MyWindow

// declare Window {
//   createTransaction: Function
// }

// declare global {
//   interface Window {
//     createTransaction: Function
//     generateWallet: Function
//     importAddress: Function
//     getTransactionSize: Function
//     btcToSat: Function
//   }
// }

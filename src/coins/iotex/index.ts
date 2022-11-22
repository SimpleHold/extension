// import Antenna from 'iotex-antenna'
// import BigNumber from 'bignumber.js'
// import { toRau } from 'iotex-antenna/lib/account/utils'

// // Types
// import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

// export const config: TCurrencyConfig = {
//   coins: ['iotx'],
//   isInternalTx: true,
// }

// const antenna = new Antenna('https://api.mainnet.iotex.one:443', 1)
// const ten18 = new BigNumber(10).pow(18)

// export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
//   if (type === 'from') {
//     return Number(new BigNumber(value).div(ten18))
//   }

//   return Number(new BigNumber(value).multipliedBy(ten18))
// }

// export const generateAddress = async (): Promise<TGenerateAddress | null> => {
//   const { address, privateKey } = antenna.iotx.accounts.create()

//   return {
//     address,
//     privateKey,
//   }
// }

// export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
//   const { address } = antenna.iotx.accounts.privateKeyToAccount(privateKey)

//   return address
// }

// export const getTransactionLink = (hash: string): string => {
//   return `https://iotexscout.io/tx/${hash}`
// }

// export const getExplorerLink = (address: string): string => {
//   return `https://iotexscout.io/address/${address}`
// }

// export const validateAddress = (address: string): boolean => {
//   return new RegExp('^(io)[0-9A-Za-z]{30,70}$').test(address)
// }

// export const getStandingFee = (): number => {
//   return 0.01
// }

// export const createInternalTx = async ({
//   addressFrom,
//   addressTo,
//   amount,
//   privateKey,
// }: TInternalTxProps): Promise<string | null> => {
//   if (privateKey) {
//     antenna.iotx.accounts.privateKeyToAccount(privateKey)

//     return await antenna.iotx.sendTransfer({
//       from: addressFrom,
//       to: addressTo,
//       value: toRau(amount, 'iotx'),
//       gasLimit: '100000',
//       gasPrice: toRau('1', 'Qev'),
//     })
//   }

//   return null
// }

export {}

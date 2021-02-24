import { v4 } from 'uuid'

export interface IWallet {
  symbol: string
  balance: string
  address: string
  uuid: string
  privateKey: string
}

export interface IBackup {
  wallets: IWallet[]
  version: number
  uuid: string
}

export const generate = (address: string, privateKey: string): string => {
  return JSON.stringify({
    wallets: [
      {
        symbol: 'btc',
        balance: '0',
        address,
        uuid: v4(),
        privateKey,
      },
    ],
    version: 1,
    uuid: v4(),
  })
}

export const validate = (backup: string): boolean => {
  return true // Fix me
}

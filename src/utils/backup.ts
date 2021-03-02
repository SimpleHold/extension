import { v4 } from 'uuid'

import { IWallet } from '@utils/wallet'

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
        address,
        uuid: v4(),
        privateKey,
      },
    ],
    version: 1,
    uuid: v4(),
  })
}

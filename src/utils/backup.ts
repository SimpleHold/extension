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

export const download = (backup: string): void => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backup))
  element.setAttribute('download', 'backup.dat')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

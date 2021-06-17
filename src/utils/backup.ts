import { v4 } from 'uuid'

import { IWallet } from '@utils/wallet'
import { validateWallet } from '@utils/validate'

export const generate = (address: string, privateKey: string): { [key: string]: string } => {
  const walletUuid = v4()
  const backup = JSON.stringify({
    wallets: [
      {
        symbol: 'btc',
        address,
        uuid: walletUuid,
        privateKey,
        createdAt: new Date(),
      },
    ],
    version: 1.7,
    uuid: v4(),
  })

  const wallets = JSON.stringify([
    {
      symbol: 'btc',
      address,
      uuid: walletUuid,
      createdAt: new Date(),
    },
  ])

  return {
    backup,
    wallets,
  }
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

export const validate = (backup: string): string | null => {
  if (backup?.length) {
    const parseBackup = JSON.parse(backup)

    if (parseBackup?.wallets) {
      const validateWalletsList = validateWallet(JSON.stringify(parseBackup?.wallets))

      if (validateWalletsList && parseBackup.version && parseBackup.uuid) {
        parseBackup?.wallets.forEach((wallet: IWallet) => delete wallet.privateKey)

        return JSON.stringify(parseBackup.wallets)
      }
    }
  }
  return null
}

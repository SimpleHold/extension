import { v4 } from 'uuid'

// Utils
import { IWallet } from '@utils/wallet'
import { validateWallet } from '@utils/validate'

import * as manifest from '../manifest.json'

type TGenerateCurrency = {
  symbol: string
  chain?: string
  data: TGenerateAddress
}

type TBackup = {
  wallets: IWallet[]
  version: string
  uuid: string
}

export const generate = (currencies: TGenerateCurrency[]): { [key: string]: string } => {
  const wallets: IWallet[] = []

  const backup: TBackup = {
    wallets: [],
    version: manifest.version,
    uuid: v4(),
  }

  for (const currency of currencies) {
    const {
      symbol,
      chain,
      data: { address, privateKey, mnemonic },
    } = currency

    const data = {
      symbol,
      chain,
      address,
      uuid: v4(),
      createdAt: new Date(),
    }

    wallets.push(data)
    backup.wallets.push({ ...data, ...{ privateKey, mnemonic } })
  }

  return {
    backup: JSON.stringify(backup),
    wallets: JSON.stringify(wallets),
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

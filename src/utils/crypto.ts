import { AES, enc } from 'crypto-js'
import { v4 } from 'uuid'

import { validateWallet } from '@utils/validate'

export const encrypt = (message: string, key: string): string => {
  return AES.encrypt(message, key).toString()
}

export const decrypt = (message: string, key: string): string | null => {
  try {
    const bytes = AES.decrypt(message, key)
    return bytes.toString(enc.Utf8)
  } catch {
    return null
  }
}

export const generateBackUp = (address: string, privateKey: string): string => {
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

export const addNewWallet = (privateKey: string, address: string, symbol: string) => {
  const walletsList = localStorage.getItem('wallets')

  if (walletsList) {
    const parseWallets = JSON.parse(walletsList)
    const validate = validateWallet(parseWallets)

    if (validate) {
      parseWallets.wallets.push({
        symbol,
        address,
        uuid: v4(),
        privateKey,
      })

      return JSON.stringify(parseWallets)
    }
  }
  return null
}

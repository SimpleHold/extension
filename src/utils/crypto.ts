import { AES } from 'crypto-js'
import { v4 } from 'uuid'

export const encrypt = (message: string, key: string): string => {
  return AES.encrypt(message, key).toString()
}

export const decrypt = (message: string, key: string): string => {
  const bytes = AES.decrypt(message, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const generateBackUp = (address: string, privateKey: string) => {
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

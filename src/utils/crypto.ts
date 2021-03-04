import { AES, enc } from 'crypto-js'

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

import nuls from 'nuls-sdk-js'

export const coins: string[] = ['nuls']
const chainId = 3

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const { address, pri: privateKey } = nuls.newAddress(chainId, '', '')

    if (address && privateKey) {
      return {
        address,
        privateKey,
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const importByKey = nuls.importByKey(chainId, privateKey, '', '')

    if (importByKey?.address) {
      return importByKey.address
    }

    return null
  } catch {
    return null
  }
}

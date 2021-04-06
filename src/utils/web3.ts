import Web3 from 'web3'

const web3 = new Web3()

export type TWeb3Symbols = 'eth' | 'etc' | 'bsc'

export const generateAddress = (): TGenerateAddress | null => {
  try {
    const item = web3.eth.accounts.create()

    return {
      privateKey: item.privateKey,
      address: item.address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey).address
  } catch {
    return null
  }
}

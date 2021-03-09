import { validateWallet } from '@utils/validate'
import { v4 } from 'uuid'

export interface IWallet {
  symbol: string
  balance?: number
  address: string
  uuid: string
  privateKey?: string
}

export const getWallets = (): IWallet[] | null => {
  try {
    const walletsList = localStorage.getItem('wallets')

    if (walletsList) {
      const parseWallets = JSON.parse(walletsList)

      return parseWallets
    }
    return null
  } catch {
    return null
  }
}

export const updateBalance = (address: string, amount: number): void => {
  const wallets = getWallets()
  const findWallet = wallets?.find((wallet: IWallet) => wallet.address === address)

  if (findWallet) {
    findWallet.balance = amount
    localStorage.setItem('wallets', JSON.stringify(wallets))
  }
}

export const getLatestBalance = (address: string): number => {
  const wallets = getWallets()

  if (wallets) {
    const findWallet = wallets.find((wallet: IWallet) => wallet.address === address)

    if (findWallet) {
      return findWallet.balance || 0
    }
  }

  return 0
}

export const checkExistWallet = (address: string): boolean => {
  const wallets = getWallets()

  if (wallets?.length) {
    return wallets.find((wallet: IWallet) => wallet.address === address) !== undefined
  }
  return false
}

export const getWalletsFromBackup = (backup: string): string | null => {
  const parsebackup = JSON.parse(backup)

  if (parsebackup) {
    const validateWallets = validateWallet(backup)

    if (validateWallets) {
      return parsebackup.wallets.map((wallet: IWallet) => {
        const { symbol, balance = 0, address } = wallet
        return {
          symbol,
          balance,
          address,
        }
      })
    }
  }

  return null
}

export const addNew = (privateKey: string, address: string, symbol: string) => {
  const walletsList = localStorage.getItem('wallets')

  if (walletsList) {
    const parseWallets = JSON.parse(walletsList)
    const validate = validateWallet(parseWallets)

    if (validate) {
      parseWallets.push({
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

import { validateWallet } from '@utils/validate'

export interface IWallet {
  symbol: string
  balance?: number
  address: string
  uuid: string
  privateKey?: string
  platform?: string
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

export const addNew = (
  address: string,
  symbol: string,
  uuid: string,
  platform?: string
): string | null => {
  const walletsList = localStorage.getItem('wallets')
  const validateWallets = validateWallet(walletsList)

  if (validateWallets && walletsList) {
    const parseWallets = JSON.parse(walletsList)

    parseWallets.push({
      symbol,
      address,
      uuid,
      platform,
    })

    return JSON.stringify(parseWallets)
  }
  return null
}

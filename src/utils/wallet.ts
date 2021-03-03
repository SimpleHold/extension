export interface IWallet {
  symbol: string
  balance: string
  address: string
  uuid: string
  privateKey: string
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

export const validate = (wallet: string | null): boolean => {
  if (!wallet) {
    return false
  }
  return true // Fix me
}

export const setBalance = (address: string): void => {}

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
    const validateWallets = validate(backup)

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

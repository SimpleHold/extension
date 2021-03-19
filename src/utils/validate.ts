import { IWallet } from '@utils/wallet'

export const validatePassword = (password: string) => {
  return password?.length >= 8
}

export const validateWallet = (wallets: string | null) => {
  if (!wallets?.length) {
    return false
  }

  const parseWallets = JSON.parse(wallets)

  if (parseWallets) {
    const totalWallets = parseWallets.length
    const filterWallets = parseWallets.filter((wallet: IWallet) => wallet.address && wallet.symbol)

    return filterWallets.length === totalWallets
  }
  return false
}

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
    const totalWallets = parseWallets.filter((wallet: IWallet) => !wallet.isNotActivated).length
    const filterWallets = parseWallets
      .filter((wallet: IWallet) => !wallet.isNotActivated)
      .filter((wallet: IWallet) => wallet.address && wallet.symbol)

    return filterWallets.length === totalWallets
  }
  return false
}

export const validateUrl = (url: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(url)
}

export const validateMany = (checks: { [key: string]: number | boolean }) => {
  const values = Object.values(checks)
  for (const value of values) {
    if (!value) return false
  }
  return true
}

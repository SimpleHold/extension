export const validateBitcoinPrivateKey = (privateKey: string) => {
  return new RegExp(/^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/).test(privateKey)
}

export const validatePassword = (password: string) => {
  return password?.length >= 8
}

export const validateWallet = (wallet: any) => {
  return true // Fix me
}

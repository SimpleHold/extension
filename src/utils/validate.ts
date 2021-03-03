export const validateBitcoinPrivateKey = (privateKey: string) => {
  return new RegExp(/^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/).test(privateKey)
}

export const validatePassword = (password: string) => {
  return password?.length >= 8
}

export const validateWallet = (wallet: any) => {
  return true // Fix me
}

export const validateBitcoinAddress = (address: string) => {
  return new RegExp(/^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$/).test(address)
}

export const validateNumbersDot = (data: string | number) => {
  return new RegExp(/^[0-9]*\.?[0-9]*$/).test(`${data}`)
}

import bitcore from 'bitcore-lib'

export const generateWallet = () => {
  const privateKey = new bitcore.PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const getBalance = (address: string): Promise<number> | null => {
  try {
    return fetch(`https://blockchain.info/balance?active=${address}`)
      .then((response) => response.json())
      .then((data) => {
        return data[address].final_balance / 100000000
      })
  } catch {
    return null
  }
}

export const getEstimated = (amount: number): number | null => {
  try {
    return 100 // Fix me
  } catch {
    return null
  }
}

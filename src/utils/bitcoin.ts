import bitcore from 'bitcore-lib'

export const generateWallet = () => {
  const privateKey = new bitcore.PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const getBalance = (address: string): Promise<number> | number => {
  try {
    return fetch(`https://blockchain.info/balance?active=${address}`)
      .then((response) => response.json())
      .then((data) => {
        return data[address].final_balance / 100000000
      })
  } catch {
    return 0
  }
}

export const getEstimated = (amount: number): Promise<number> | number => {
  try {
    if (amount === 0) {
      return 0
    }
    return fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then((response) => response.json())
      .then((data) => {
        return data['USD'] * amount
      })
  } catch {
    return 0
  }
}

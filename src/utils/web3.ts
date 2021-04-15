import Web3 from 'web3'

const web3 = new Web3()

export type TWeb3Symbols = 'eth' | 'etc' | 'bnb'

export type Unit =
  | 'noether'
  | 'wei'
  | 'kwei'
  | 'Kwei'
  | 'babbage'
  | 'femtoether'
  | 'mwei'
  | 'Mwei'
  | 'lovelace'
  | 'picoether'
  | 'gwei'
  | 'Gwei'
  | 'shannon'
  | 'nanoether'
  | 'nano'
  | 'szabo'
  | 'microether'
  | 'micro'
  | 'finney'
  | 'milliether'
  | 'milli'
  | 'ether'
  | 'kether'
  | 'grand'
  | 'mether'
  | 'gether'
  | 'tether'

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

export const fromWei = (value: string, unit: Unit): number => {
  return +web3.utils.fromWei(value, unit)
}

export const toWei = (value: string, unit: Unit): number => {
  return +web3.utils.toWei(value, unit)
}

export const createTransaction = async (
  from: string,
  to: string,
  amount: number,
  privateKey: string
): Promise<TCreatedTransaction | null> => {
  try {
    const { gasLimit } = await web3.eth.getBlock('latest')
    const gasPrice = await web3.eth.getGasPrice()

    const { rawTransaction, transactionHash } = await web3.eth.accounts.signTransaction(
      {
        from,
        to,
        value: web3.utils.toWei(`${amount}`, 'ether'),
        gas: gasLimit,
        gasPrice: web3.utils.fromWei(gasPrice, 'gwei'),
      },
      privateKey
    )

    if (rawTransaction && transactionHash) {
      return {
        raw: rawTransaction,
        hash: transactionHash,
      }
    }

    return null
  } catch {
    return null
  }
}

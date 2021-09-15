import BigNumber from 'bignumber.js'

// Types
import { TInternalTxProps } from '../types'

const ten12 = new BigNumber(10).pow(12)

export const coins: string[] = ['zil']
export const isInternalTx = true

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten12))
  }

  return Number(new BigNumber(value).multipliedBy(ten12))
}

const pkToBech32 = (privateKey: string): string => {
  const { with0x } = Zilliqa.getAccountFrom0xPrivateKey(privateKey)

  return with0x.bech32
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const privateKey = Zilliqa.schnorr.generatePrivateKey()

    return {
      privateKey,
      address: pkToBech32(privateKey),
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return pkToBech32(privateKey)
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://viewblock.io/zilliqa/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://viewblock.io/zilliqa/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return Zilliqa.validation.isBech32(address)
  } catch {
    return false
  }
}

export const getStandingFee = (): number => {
  return 0.1
}

export const createInternalTx = async ({
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  try {
    const zilliqa = new Zilliqa.Zilliqa('https://api.zilliqa.com')

    const fromPublicKey = Zilliqa.getPubKeyFromPrivateKey(privateKey)
    const fromAddress = Zilliqa.getAddressFromPrivateKey(privateKey)

    const nextNonce = (await zilliqa.blockchain.getBalance(fromAddress)).result.nonce + 1
    const getGasPrice = await zilliqa.blockchain.getMinimumGasPrice()

    if (getGasPrice?.result) {
      const rawTx = zilliqa.transactions.new({
        version: Zilliqa.bytes.pack(1, 1),
        amount: new Zilliqa.BN(Zilliqa.units.toQa(amount * 1000000, Zilliqa.units.Units.Li)),
        nonce: nextNonce,
        gasLimit: Zilliqa.Long.fromNumber(50),
        gasPrice: new Zilliqa.BN(getGasPrice.result),
        toAddr: addressTo,
        pubKey: fromPublicKey,
      })

      zilliqa.wallet.addByPrivateKey(privateKey)

      const signedTx = await zilliqa.wallet.signWith(rawTx, fromAddress)
      const res = await zilliqa.provider.send('CreateTransaction', signedTx.txParams)

      if (res.result.TranID) {
        return `0x${res.result.TranID}`
      }
    }

    return null
  } catch {
    return null
  }
}

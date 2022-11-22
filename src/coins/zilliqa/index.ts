import { Zilliqa } from '@zilliqa-js/zilliqa'
import { validation, BN, Long, bytes, units } from '@zilliqa-js/util'
import {
  getAddressFromPrivateKey,
  getAccountFrom0xPrivateKey,
  schnorr,
  getPubKeyFromPrivateKey,
} from '@zilliqa-js/crypto'
import BigNumber from 'bignumber.js'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['zil'],
  isInternalTx: true,
}

const ten12 = new BigNumber(10).pow(12)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten12))
  }

  return Number(new BigNumber(value).multipliedBy(ten12))
}

const pkToBech32 = (privateKey: string): string => {
  const { with0x } = getAccountFrom0xPrivateKey(privateKey)

  return with0x.bech32
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const privateKey = schnorr.generatePrivateKey()

  return {
    privateKey,
    address: pkToBech32(privateKey),
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return pkToBech32(privateKey)
}

export const getExplorerLink = (address: string): string => {
  return `https://viewblock.io/zilliqa/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://viewblock.io/zilliqa/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return validation.isBech32(address)
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
  if (!privateKey) {
    return null
  }

  const zilliqa = new Zilliqa('https://api.zilliqa.com')

  const fromPublicKey = getPubKeyFromPrivateKey(privateKey)
  const fromAddress = getAddressFromPrivateKey(privateKey)

  const nextNonce = (await zilliqa.blockchain.getBalance(fromAddress)).result.nonce + 1
  const getGasPrice = await zilliqa.blockchain.getMinimumGasPrice()

  const formatAmount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(6)).toNumber()

  if (getGasPrice?.result) {
    const rawTx = zilliqa.transactions.new({
      version: bytes.pack(1, 1),
      amount: new BN(units.toQa(formatAmount, units.Units.Li)),
      nonce: nextNonce,
      gasLimit: Long.fromNumber(50),
      gasPrice: new BN(getGasPrice.result),
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
}

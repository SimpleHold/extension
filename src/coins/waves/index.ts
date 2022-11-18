import { address, randomSeed, privateKey } from '@waves/ts-lib-crypto'
const { transfer, broadcast } = require('@waves/waves-transactions')
import BigNumber from 'bignumber.js'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['waves'],
  wordsSize: [15],
  isWithPhrase: true,
  isInternalTx: true,
}

const ten8 = new BigNumber(10).pow(8)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const mnemonic = randomSeed()

  return {
    mnemonic,
    address: address(mnemonic),
    privateKey: privateKey(mnemonic),
  }
}

export const importRecoveryPhrase = async (mnemonic: string): Promise<TGenerateAddress | null> => {
  return {
    mnemonic,
    address: address(mnemonic),
    privateKey: privateKey(mnemonic),
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://wavesexplorer.com/addresses/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://wavesexplorer.com/transactions/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(3P)[0-9A-Za-z]{33}$').test(address)
}

export const getStandingFee = (): number => {
  return 0.001
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { mnemonic, addressTo, amount } = props

  if (!mnemonic) {
    return null
  }

  const signedTx = transfer(
    {
      recipient: addressTo,
      amount: formatValue(amount, 'to'),
    },
    mnemonic
  )

  const { id } = await broadcast(signedTx, 'https://nodes.wavesplatform.com')

  return id
}

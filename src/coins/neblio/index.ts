import BigNumber from 'bignumber.js'
import neblioLib from 'neblio-lib'

// Utils
import { sendRawTransaction } from '@utils/api'

// Types
import {
  TGenerateAddress,
  TUnspentOutput,
  TInternalTxProps,
  TCurrencyConfig,
  TFeeProps,
} from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['nebl'],
  isWithOutputs: true,
  isInternalTx: true,
}

const ten8 = new BigNumber(10).pow(8)

export const toSat = (value: string | number): string => {
  return new BigNumber(value).multipliedBy(ten8).toString()
}

export const fromSat = (value: string | number): string => {
  return new BigNumber(value).div(ten8).toString()
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +fromSat(value)
  }

  return +toSat(value)
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const privateKey = new neblioLib.PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return new neblioLib.PrivateKey(privateKey).toAddress().toString()
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.nebl.io/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.nebl.io/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^N[A-Za-z0-9]{33}$').test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse> => {
  const { outputs, amount } = props
  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: TUnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = formatValue(0.0002, 'to')

    if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  return {
    networkFee: 0.0002,
    utxos,
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { privateKey, amount, networkFee, outputs, addressTo, addressFrom } = props

  if (!privateKey || !outputs) {
    return null
  }

  const formatAmount = +formatValue(amount, 'to')
  const formatFee = +formatValue(networkFee, 'to')

  const rawTx = neblioLib
    .Transaction()
    .from(outputs)
    .to(addressTo, formatAmount)
    .fee(formatFee)
    .change(addressFrom)
    .sign(privateKey)
    .toString()

  return await sendRawTransaction(rawTx, 'neblio')
}

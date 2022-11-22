import * as bitcoin from 'bitcoinjs-lib'
import bitcoreLibCash from 'bitcore-lib-cash'
import bitcoreLibSV from 'bsv'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'

// Utils
import { toLower } from '@utils/format'
import { getFeeRate, getTxHex } from '@utils/api'
import getByteCount from './getByteCount'
import { minus, plus } from '@utils/bn'

// Config
import { LITECOIN, DOGECOIN, DASH } from './networks'
import validation, { TValidateItem } from './validation'

// Types
import {
  TGenerateAddress,
  TUnspentOutput,
  TCreateTxProps,
  TCurrencyConfig,
  TFeeProps,
} from '../types'
import { TFeeResponse, TFeeTypes, TFee } from '../../utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['btc', 'ltc', 'doge', 'dash', 'bch', 'bsv'],
  isWithOutputs: true,
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

const getNetwork = (symbol: string): bitcoin.networks.Network => {
  if (symbol === 'ltc') {
    return LITECOIN
  }

  if (symbol === 'doge') {
    return DOGECOIN
  }

  if (symbol === 'dash') {
    return DASH
  }

  return bitcoin.networks.bitcoin
}

const getModule = (symbol: string) => {
  if (symbol === 'bch') {
    return bitcoreLibCash
  }

  return bitcoreLibSV
}

const isNotBitcoinLib = (symbol: string): boolean => {
  return ['bch', 'bsv'].indexOf(symbol) !== -1
}

export const generateAddress = async (symbol: string): Promise<TGenerateAddress | null> => {
  try {
    if (isNotBitcoinLib(symbol)) {
      const module = getModule(symbol)
      const privateKey = new module.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    const network = getNetwork(symbol)

    const keyPair = bitcoin.ECPair.makeRandom({ network })

    const privateKey = keyPair.privateKey?.toString('hex')
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    })

    if (privateKey && address) {
      return {
        privateKey,
        address,
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = async (
  privateKey: string,
  symbol: string
): Promise<string | null> => {
  try {
    if (isNotBitcoinLib(symbol)) {
      const module = getModule(symbol)

      return new module.PrivateKey(privateKey).toAddress().toString()
    }

    const network = getNetwork(symbol)

    const keyPair = getKeyPair(privateKey, network)

    if (!keyPair) {
      return null
    }

    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    })

    return address || null
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string, chain: string): string => {
  return `https://blockchair.com/${chain}/address/${address}?from=simplehold`
}

export const getTransactionLink = (hash: string, chain: string): string => {
  return `https://blockchair.com/${chain}/transaction/${hash}?from=simplehold`
}

export const validateAddress = (address: string, symbol: string): boolean => {
  const findRegex = validation.find((i: TValidateItem) => toLower(i.symbol) === toLower(symbol))

  if (findRegex?.pattern) {
    return new RegExp(findRegex.pattern).test(address)
  }

  return false
}

const getFeeType = (type: string): TFeeTypes => {
  if (type === 'slow') {
    return 'slow'
  }
  if (type === 'average') {
    return 'average'
  }

  return 'fast'
}

const getFee = (utxos: TUnspentOutput[], value: number): number => {
  return getByteCount({ P2PKH: utxos.length }, { P2WSH: 2 }) * value
}

export const getUtxos = (
  symbol: string,
  outputs: TUnspentOutput[],
  amount: string
): TUnspentOutput[] => {
  const utxos: TUnspentOutput[] = []

  if (symbol === 'doge') {
    const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = getFee(utxos, 1)

      if (getUtxosValue >= +toSat(amount) + transactionFeeBytes) {
        break
      }

      utxos.push(output)
    }
  }

  return utxos
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { chain, outputs, amount } = props
  const fees: TFee[] = []

  const feeRate = await getFeeRate(chain)

  for (const type in feeRate) {
    const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
    const utxos: TUnspentOutput[] = []

    const feeType = getFeeType(type)
    const getTypeValue = feeRate[feeType]

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = getFee(utxos, getTypeValue)

      if (getUtxosValue >= Number(toSat(amount)) + transactionFeeBytes) {
        break
      }

      utxos.push(output)
    }

    const value = +fromSat(getFee(utxos, getTypeValue))

    fees.push({
      type: feeType,
      utxos,
      value,
    })
  }

  return {
    fees,
  }
}

const getKeyPair = (privateKey: string, network: bitcoin.networks.Network) => {
  try {
    return bitcoin.ECPair.fromWIF(privateKey, network)
  } catch {
    try {
      return bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
        network,
      })
    } catch {
      return null
    }
  }
}

export const createUnsignedTx = async (
  addressFrom: string,
  addressTo: string,
  amount: number,
  fee: number,
  outputs: TUnspentOutput[]
): Promise<string | null> => {
  try {
    const formatAmount = +toSat(amount)
    const formatFee = +toSat(fee)

    const network = getNetwork('btc')
    const psbt = new bitcoin.Psbt({ network })

    for (const output of outputs) {
      const { txId, outputIndex } = output
      const txHex = await getTxHex('bitcoin', txId)

      if (!txHex) {
        return null
      }

      psbt.addInput({
        hash: txId,
        index: outputIndex,
        nonWitnessUtxo: Buffer.from(txHex, 'hex'),
      })
    }

    psbt.setMaximumFeeRate(9999999)

    psbt.addOutput({
      address: addressTo,
      value: formatAmount,
    })

    const totalOutputsAmount = outputs.reduce((a, b) => a + b.satoshis, 0)

    const opReturnAmount = minus(totalOutputsAmount, plus(formatAmount, formatFee))

    if (opReturnAmount !== 0) {
      psbt.addOutput({
        address: addressFrom,
        value: opReturnAmount,
      })
    }

    const transaction = psbt.extractTransaction()
    return transaction.toHex()
  } catch {
    return null
  }
}

export const createTx = async ({
  chain,
  addressFrom,
  addressTo,
  amount,
  privateKey,
  utxos,
  symbol,
  fee,
}: TCreateTxProps): Promise<string | null> => {
  if (!privateKey) {
    return null
  }

  const formatAmount = +toSat(amount)
  const formatFee = +toSat(fee)

  if (isNotBitcoinLib(symbol)) {
    const module = getModule(symbol)

    const transaction = new module.Transaction()
      .from(utxos)
      .to(addressTo, formatAmount)
      .fee(formatFee)
      .change(addressFrom)
      .sign(privateKey)

    return transaction.toString()
  }

  const network = getNetwork(symbol)
  const psbt = new bitcoin.Psbt({ network })
  const keyPair = getKeyPair(privateKey, network)

  if (!keyPair) {
    return null
  }

  for (const output of utxos) {
    const { txId, outputIndex } = output
    const txHex = await getTxHex(chain, txId)

    if (!txHex) {
      return null
    }

    psbt.addInput({
      hash: txId,
      index: outputIndex,
      nonWitnessUtxo: Buffer.from(txHex, 'hex'),
    })
  }

  psbt.setMaximumFeeRate(9999999)

  psbt.addOutput({
    address: addressTo,
    value: formatAmount,
  })

  const totalOutputsAmount = utxos.reduce((a, b) => a + b.satoshis, 0)

  const opReturnAmount = minus(totalOutputsAmount, plus(formatAmount, formatFee))

  if (opReturnAmount !== 0) {
    psbt.addOutput({
      address: addressFrom,
      value: opReturnAmount,
    })
  }

  psbt.signAllInputs(keyPair)
  psbt.validateSignaturesOfAllInputs()
  psbt.finalizeAllInputs()
  const transaction = psbt.extractTransaction()
  const signedTransaction = transaction.toHex()

  return signedTransaction
}

export const getStandingFee = (symbol: string): number => {
  if (symbol === 'doge') {
    return 1
  }

  return 0
}

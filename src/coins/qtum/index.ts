import BigNumber from 'bignumber.js'
import * as bitcoin from 'bitcoinjs-lib'

// Utils
import { getTxHex, sendRawTransaction } from '@utils/api'
import { minus, plus } from '@utils/bn'
import getByteCount from './getByteCount'

// Config
import { mainnet } from './config'

// Types
import {
  TGenerateAddress,
  TCurrencyConfig,
  TInternalTxProps,
  TFeeProps,
  TUnspentOutput,
} from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['qtum'],
  isWithOutputs: true,
  isInternalTx: true,
}

const ten8 = new BigNumber(10).pow(8)
const feeRate = 600

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

const getAddress = (pubkey: Buffer): string | null => {
  const { address } = bitcoin.payments.p2pkh({ pubkey, network: mainnet })

  return address || null
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const keyPair = bitcoin.ECPair.makeRandom({ network: mainnet })

  const privateKey = keyPair.privateKey?.toString('hex')
  const address = getAddress(keyPair.publicKey)

  if (privateKey && address) {
    return {
      privateKey,
      address,
    }
  }

  return null
}

const getKeyPair = (privateKey: string) => {
  try {
    return bitcoin.ECPair.fromWIF(privateKey, mainnet)
  } catch {
    try {
      return bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
        network: mainnet,
      })
    } catch {
      return null
    }
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const keyPair = getKeyPair(privateKey)

  if (keyPair) {
    return getAddress(keyPair.publicKey)
  }

  return null
}

export const getExplorerLink = (address: string): string => {
  return `https://qtum.info/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://qtum.info/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^[Q|M][A-Za-z0-9]{33}$').test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse> => {
  const { outputs, amount } = props
  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: TUnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getByteCount({ P2PKH: utxos.length }, { P2WSH: 2 }) * feeRate

    if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  return {
    networkFee: formatValue(getByteCount({ P2PKH: utxos.length }, { P2WSH: 2 }) * feeRate, 'from'),
    utxos,
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { privateKey, amount, networkFee, outputs, addressTo, addressFrom } = props

  if (!privateKey || !outputs) {
    return null
  }

  const psbt = new bitcoin.Psbt({ network: mainnet })
  const keyPair = getKeyPair(privateKey)

  if (!keyPair) {
    return null
  }

  const formatAmount = +formatValue(amount, 'to')
  const formatFee = +formatValue(networkFee, 'to')

  for (const output of outputs) {
    const { txId, outputIndex } = output
    const txHex = await getTxHex('qtum', txId)

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

  psbt.signAllInputs(keyPair)
  psbt.validateSignaturesOfAllInputs()
  psbt.finalizeAllInputs()
  const transaction = psbt.extractTransaction()
  const signedTransaction = transaction.toHex()

  return await sendRawTransaction(signedTransaction, 'qtum')
}

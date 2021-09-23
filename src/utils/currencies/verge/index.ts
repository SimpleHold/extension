import * as vergeLib from 'vergejs-lib'
import BigNumber from 'bignumber.js'
import axios, { AxiosResponse } from 'axios'
import { Buffer } from 'buffer'

// Utils
import { plus, minus } from '@utils/format'
import { sendRawTransaction } from '@utils/api'

// Types
import { TInternalTxProps } from '../types'

export const coins: string[] = ['xvg']
export const isWithOutputs = true
export const isInternalTx = true

const ten6 = new BigNumber(10).pow(6)
const network = vergeLib.networks.verge

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const keyPair = vergeLib.ECPair.makeRandom({ network })
    const { address } = vergeLib.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    })

    if (address) {
      return {
        address,
        privateKey: keyPair.toWIF().toString(),
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const keyPair = vergeLib.ECPair.fromWIF(privateKey, network)

    const { address } = vergeLib.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    })

    return address || null
  } catch {
    return null
  }
}

const getTxHex = async (txId: string): Promise<string | null> => {
  try {
    const { data }: AxiosResponse = await axios({
      method: 'GET',
      url: `https://verge-blockchain.info/api/tx/${txId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return data.data.hex
  } catch {
    return null
  }
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
  networkFee,
  outputs,
}: TInternalTxProps): Promise<string | null> => {
  try {
    if (!outputs?.length) {
      return null
    }

    const keyPair = vergeLib.ECPair.fromWIF(privateKey, network)
    const psbt = new vergeLib.Psbt({ network })

    const formatAmount = formatValue(amount, 'to')

    for (const output of outputs) {
      const { txId, outputIndex } = output
      const txHex = await getTxHex(txId)

      if (!txHex) {
        return null
      }

      psbt.addInput({
        hash: txId,
        index: outputIndex,
        nonWitnessUtxo: Buffer.from(txHex, 'hex'),
      })
    }

    psbt.addOutput({
      address: addressTo,
      value: formatAmount,
    })

    const totalOutputsAmount = outputs.reduce((a, b) => a + b.satoshis, 0)

    const opReturnAmount = minus(totalOutputsAmount, plus(formatAmount, networkFee))

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

    return await sendRawTransaction(signedTransaction, 'verge')
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    vergeLib.address.toOutputScript(address, network)
    return true
  } catch {
    return false
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://verge-blockchain.info/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://verge-blockchain.info/tx/${hash}`
}

export const getStandingFee = (): number => {
  return 0.1
}

export const getUtxos = (
  outputs: UnspentOutput[],
  address: string,
  amount: string
): UnspentOutput[] => {
  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    if (getUtxosValue >= formatValue(Number(amount), 'to') + 0.1) {
      break
    }

    utxos.push(output)
  }

  return utxos
}

import * as vergeLib from 'vergejs-lib'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'

// Utils
import { getTxHex } from '@utils/api'
import { minus, plus } from '@utils/format'

// Types
import { TGenerateAddress, TCreateTxProps, TUnspentOutput, TCurrencyConfig } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['xvg'],
  isWithOutputs: true,
}

const ten6 = new BigNumber(10).pow(6)
const network = vergeLib.networks.verge

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return new BigNumber(value).div(ten6).toNumber()
  }

  return new BigNumber(value).multipliedBy(ten6).toNumber()
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
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
}

export const importPrivateKey = (privateKey: string): string | null => {
  const keyPair = vergeLib.ECPair.fromWIF(privateKey, network)

  const { address } = vergeLib.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  })

  return address || null
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

export const validateAddress = (address: string): boolean => {
  try {
    vergeLib.address.toOutputScript(address, network)
    return true
  } catch {
    return false
  }
}

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  const { addressFrom, addressTo, amount, privateKey, fee, utxos } = props

  if (!utxos?.length || !privateKey) {
    return null
  }

  const formatAmount = +formatValue(amount, 'to')
  const formatFee = +formatValue(fee, 'to')

  const keyPair = vergeLib.ECPair.fromWIF(privateKey, network)
  const psbt = new vergeLib.Psbt({ network })

  psbt.setMaximumFeeRate(99999999)

  for (const output of utxos) {
    const { txId, outputIndex } = output
    const txHex = await getTxHex('verge', txId)

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

  return psbt.extractTransaction().toHex()
}

export const getUtxos = (outputs: TUnspentOutput[], amount: string): TUnspentOutput[] => {
  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: TUnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    if (getUtxosValue >= formatValue(Number(amount), 'to') + 0.1) {
      break
    }

    utxos.push(output)
  }

  return utxos
}

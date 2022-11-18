import { Mnemonic } from '@elrondnetwork/erdjs-walletcore'
import BigNumber from 'bignumber.js'

// Utils
import { getNetworkFeeRequest, sendRequest, getTxParams } from '@utils/api'
import { multiplied, plus } from '@utils/bn'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps, TFeeProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'
import { TTxParams, TTxResponse } from './types'

export const config: TCurrencyConfig = {
  coins: ['egld'],
  isInternalTx: true,
  wordsSize: [12, 24],
  isWithPhrase: true,
  extraIdName: 'Custom Data',
}

const ten18 = new BigNumber(10).pow(18)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten18))
  }

  return Number(new BigNumber(value).multipliedBy(ten18))
}

const getAddress = (mnemonic: Mnemonic): string => {
  return mnemonic.deriveKey().generatePublicKey().toAddress().toString()
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const core = require('@elrondnetwork/elrond-core-js')
  const account = new core.account()

  const mnemonic = Mnemonic.generate()
  const address = getAddress(mnemonic)
  const privateKey = account.privateKeyFromMnemonic(mnemonic.toString())

  return {
    mnemonic: mnemonic.toString(),
    address,
    privateKey,
  }
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  const core = require('@elrondnetwork/elrond-core-js')
  const account = new core.account()

  const mnemonic = Mnemonic.fromString(recoveryPhrase)
  const address = getAddress(mnemonic)
  const privateKey = account.privateKeyFromMnemonic(mnemonic.toString())

  return {
    mnemonic: mnemonic.toString(),
    address,
    privateKey,
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.elrond.com/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.elrond.com/transactions/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(erd)[0-9A-Za-z]{30,70}$').test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { addressFrom, amount, chain, extraId } = props

  return await getNetworkFeeRequest(chain, addressFrom, amount, extraId)
}

const getGasLimit = (gasLimit: number, gasPerByte: number, extraId?: string): number => {
  const extraIdSize = extraId?.length ? multiplied(extraId.length, gasPerByte) : 0

  return plus(gasLimit, extraIdSize)
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { addressFrom, amount, mnemonic, extraId, addressTo } = props

  if (!mnemonic) {
    return null
  }

  const txParams: TTxParams | null = await getTxParams('elrond', addressFrom)

  if (!txParams) {
    return null
  }

  const core = require('@elrondnetwork/elrond-core-js')

  const transaction = new core.transaction({
    nonce: txParams.nonce,
    from: addressFrom,
    to: addressTo,
    senderUsername: '',
    receiverUsername: '',
    value: `${formatValue(amount, 'to')}`,
    gasPrice: txParams.gasPrice,
    gasLimit: getGasLimit(txParams.gasLimit, txParams.gasPerByte, extraId),
    data: extraId || '',
    chainID: '1',
    version: 1,
  })

  const account = new core.account()
  account.loadFromMnemonic(mnemonic)

  const serializedTransaction = transaction.prepareForSigning()
  transaction.signature = account.sign(serializedTransaction)

  const request = await sendRequest<TTxResponse>({
    url: 'https://api.elrond.com/transactions',
    method: 'POST',
    data: transaction.prepareForNode(),
    skipNestedData: true,
  })

  if (request?.txHash) {
    return request.txHash
  }

  return null
}

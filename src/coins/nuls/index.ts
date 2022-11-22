import nuls from 'nuls-sdk-js'
import BigNumber from 'bignumber.js'

// Utils
import { getTxParams } from '@utils/api'

// Types
import { TGenerateAddress, TCreateTxProps, TCurrencyConfig } from '@coins/types'
import { TTransferInfo, TBalanceInfo } from './types'

export const config: TCurrencyConfig = {
  coins: ['nuls'],
}

const chainId = 1
const ten8 = new BigNumber(10).pow(8)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const { address, pri: privateKey } = nuls.newAddress(chainId, '', '')

  if (address && privateKey) {
    return {
      address,
      privateKey,
    }
  }

  return null
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const importByKey = nuls.importByKey(chainId, privateKey, '', '')

  if (importByKey?.address) {
    return importByKey.address
  }

  return null
}

export const getExplorerLink = (address: string): string => {
  return `https://nulscan.io/address/info?address=${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://nulscan.io/transaction/info?hash=${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    const verify = nuls.verifyAddress(address)
    return verify.chainId === chainId && verify.right
  } catch {
    return false
  }
}

export const getStandingFee = (): number => {
  return 0.001
}

export const getPubKeyFromPriv = (privateKey: string): string | null => {
  try {
    const importByKey = nuls.importByKey(chainId, privateKey, '', '')

    if (importByKey?.pub) {
      return importByKey.pub
    }

    return null
  } catch {
    return null
  }
}

const Plus = (nu: number, arg: number) => {
  let newPlus = new BigNumber(nu)
  return newPlus.plus(arg)
}

const getInputsOutputs = (transferInfo: TTransferInfo, balanceInfo: TBalanceInfo) => {
  const newAmount = Number(Plus(transferInfo.amount, 100000))

  const inputs = [
    {
      address: transferInfo.fromAddress,
      assetsChainId: 1,
      assetsId: 1,
      amount: newAmount,
      locked: 0,
      nonce: balanceInfo.nonce,
    },
  ]

  const outputs = [
    {
      address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
      assetsChainId: 1,
      assetsId: 1,
      amount: transferInfo.amount,
      lockTime: 0,
    },
  ]

  return {
    inputs,
    outputs,
  }
}

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  const { addressFrom, addressTo, privateKey, amount } = props

  if (!privateKey) {
    return null
  }

  const getPubKey = getPubKeyFromPriv(privateKey)

  if (getPubKey) {
    const params = await getTxParams('nuls', addressFrom)

    const { inputs, outputs } = getInputsOutputs(
      {
        fromAddress: addressFrom,
        toAddress: addressTo,
        amount: formatValue(amount, 'to'),
      },
      params
    )

    const assembleTx = nuls.transactionAssemble(inputs, outputs, '', 2)
    return nuls.transactionSerialize(privateKey, getPubKey, assembleTx)
  }
  return null
}

import nerve from 'nerve-sdk-js'
import BigNumber from 'bignumber.js'

// Utils
import { getNerveTxParams } from '@utils/api'

// Types
import { TTransferInfo, TBalanceInfo } from './types'

export const coins: string[] = ['nvt']

const chainId = 9

const ten8 = new BigNumber(10).pow(8)

export const toNerve = (value: string | number): number => {
  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const fromNerve = (value: string | number): number => {
  return Number(new BigNumber(value).div(ten8))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const { address, pri: privateKey } = nerve.newAddress(chainId, '', '')

    if (address && privateKey) {
      return {
        address,
        privateKey,
      }
    }

    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const importByKey = nerve.importByKey(chainId, privateKey, '', '')

    if (importByKey?.address) {
      return importByKey.address
    }

    return null
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    const verify = nerve.verifyAddress(address)
    return verify.chainId === chainId && verify.right
  } catch {
    return false
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://scan.nerve.network/address/info?address=${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://scan.nerve.network/transaction/info?hash=${hash}`
}

export const getPubKeyFromPriv = (privateKey: string): string | null => {
  try {
    const importByKey = nerve.importByKey(chainId, privateKey, '', '')

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

export const createTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string
): Promise<string | null> => {
  try {
    const getPubKey = getPubKeyFromPriv(privateKey)

    if (getPubKey) {
      const params = await getNerveTxParams(fromAddress)

      const { inputs, outputs } = getInputsOutputs(
        {
          fromAddress,
          toAddress,
          amount,
        },
        params
      )

      const assembleTx = nerve.transactionAssemble(inputs, outputs, '', 2)
      return nerve.transactionSerialize(privateKey, getPubKey, assembleTx)
    }
    return null
  } catch {
    return null
  }
}

export const getStandingFee = (): number => {
  return 0.001
}

import * as thetajs from '@thetalabs/theta-js'
import BigNumber from 'bignumber.js'

// Utils
import { getNetworkFeeRequest } from '@utils/api'
import { TFeeResponse } from '@utils/api/types'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig, TFeeProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['theta', 'tfuel'],
  isInternalTx: true,
}

const ten18 = new BigNumber(10).pow(18)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten18))
  }

  return Number(new BigNumber(value).multipliedBy(ten18))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  try {
    const wallet = thetajs.Wallet.createRandom()

    return {
      address: wallet.address,
      privateKey: wallet._signingKey().privateKey,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  try {
    const wallet = new thetajs.Wallet(privateKey)
    return wallet.address
  } catch {
    return null
  }
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.thetatoken.org/txs/${hash}`
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.thetatoken.org/account/${address}`
}

export const createInternalTx = async ({
  symbol,
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  const thetaWeiToSend = symbol === 'theta' ? formatValue(amount, 'to') : new BigNumber(0)
  const tfuelWeiToSend = symbol === 'tfuel' ? formatValue(amount, 'to') : new BigNumber(0)

  const transaction = new thetajs.transactions.SendTransaction({
    from: addressFrom,
    outputs: [
      {
        address: addressTo,
        thetaWei: thetaWeiToSend,
        tfuelWei: tfuelWeiToSend,
      },
    ],
  })

  const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Mainnet)
  const wallet = new thetajs.Wallet(privateKey, provider)
  const result = await wallet.sendTransaction(transaction)

  if (result?.hash) {
    return result.hash
  }
  return null
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
}

export const getNetworkFee = async ({ addressFrom }: TFeeProps): Promise<TFeeResponse | null> => {
  try {
    return await getNetworkFeeRequest('theta', addressFrom)
  } catch {
    return null
  }
}

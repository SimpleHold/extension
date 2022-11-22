import { Harmony } from '@harmony-js/core'
import { generatePrivateKey, getAddressFromPrivateKey, getAddress } from '@harmony-js/crypto'
import {
  fromWei,
  Units,
  toWei,
  numToStr,
  ChainType,
  ChainID,
  Unit,
  isAddress,
  isBech32Address,
} from '@harmony-js/utils'

// Utils
import { getNetworkFeeRequest } from '@utils/api'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['one'],
  isInternalTx: true,
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +fromWei(`${value}`, Units.one)
  }
  return +numToStr(toWei(`${value}`, Units.one))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const privateKey = generatePrivateKey()
  const address = getAddressFromPrivateKey(privateKey)

  return {
    privateKey,
    address: getAddress(address).bech32,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return getAddress(getAddressFromPrivateKey(privateKey)).bech32
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.harmony.one/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.harmony.one/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return isAddress(address) || isBech32Address(address)
  } catch {
    return false
  }
}

export const createInternalTx = async ({
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  if (privateKey) {
    const hmy = new Harmony('https://api.harmony.one', {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    })

    hmy.wallet.addByPrivateKey(privateKey)
    hmy.blockchain.getShardingStructure()

    const txn = hmy.transactions.newTx({
      to: addressTo,
      value: new Unit(amount).asOne().toWei(),
      gasLimit: '21000',
      shardID: 0,
      toShardID: 0,
      gasPrice: new hmy.utils.Unit('100').asGwei().toWei(),
    })

    const signedTxn = await hmy.wallet.signTransaction(txn)
    const txnHash = await hmy.blockchain.sendTransaction(signedTxn)

    if (txnHash?.result) {
      return txnHash.result
    }
  }

  return null
}

export const getNetworkFee = async (): Promise<TFeeResponse | null> => {
  try {
    const request = await getNetworkFeeRequest('harmony')

    if (request) {
      return {
        networkFee: +Number(request.networkFee).toFixed(8),
      }
    }

    return null
  } catch {
    return null
  }
}

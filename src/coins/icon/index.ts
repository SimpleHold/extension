import IconSDK from 'icon-sdk-js'
import BigNumber from 'bignumber.js'

// Utils
import { getNetworkFeeRequest, sendRawTransaction } from '@utils/api'

// Types
import { TGenerateAddress, TCurrencyConfig, TFeeProps, TInternalTxProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['icx'],
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
  const wallet = IconSDK.IconWallet.create()

  return {
    address: wallet.getAddress(),
    privateKey: wallet.getPrivateKey(),
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return IconSDK.IconWallet.loadPrivateKey(privateKey).getAddress()
}

export const getExplorerLink = (address: string): string => {
  return `https://tracker.icon.community/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://tracker.icon.community/transaction/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(hx)[A-Za-z0-9]{40}$').test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { addressFrom, amount, chain } = props

  return await getNetworkFeeRequest(chain, addressFrom, amount)
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { addressFrom, addressTo, amount, privateKey } = props

  if (!privateKey) {
    return null
  }

  const txObj = new IconSDK.IconBuilder.IcxTransactionBuilder()
    .from(addressFrom)
    .to(addressTo)
    .value(IconSDK.IconAmount.of(amount, IconSDK.IconAmount.Unit.ICX).toLoop())
    .stepLimit(IconSDK.IconConverter.toBigNumber(100000))
    .nid('0x1')
    .nonce(IconSDK.IconConverter.toBigNumber(1))
    .version(IconSDK.IconConverter.toBigNumber(3))
    .timestamp(+new Date() * 1000)
    .build()

  const wallet = IconSDK.IconWallet.loadPrivateKey(privateKey)
  const signTx = new IconSDK.SignedTransaction(txObj, wallet)

  return await sendRawTransaction('', 'icon', signTx.getProperties())
}

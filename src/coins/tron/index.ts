import TronWeb from 'tronweb'
import BigNumber from 'bignumber.js'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig } from '@coins/types'
import { TAccount } from './types'

const tronWeb = new TronWeb({
  fullNode: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io',
})

const ten6 = new BigNumber(10).pow(6)

export const config: TCurrencyConfig = {
  coins: ['trx'],
  isInternalTx: true,
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  try {
    const account: TAccount = await tronWeb.createAccount()

    return {
      privateKey: account.privateKey,
      address: account.address.base58,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  try {
    return tronWeb.address.fromPrivateKey(privateKey)
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://tronscan.org/#/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://tronscan.org/#/transaction/${hash}`
}

export const getStandingFee = (symbol: string, chain: string, tokenChain?: string): number => {
  if (tokenChain) {
    return 10
  }

  return 1.1
}

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
  tokenChain,
  contractAddress,
}: TInternalTxProps): Promise<string | null> => {
  const value = formatValue(amount, 'to')

  let sendTrx = null

  if (tokenChain && contractAddress) {
    try {
      const transactionObject = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(contractAddress),
        'transfer(address,uint256)',
        {},
        [
          { type: 'address', value: addressTo },
          { type: 'uint256', value: value },
        ],
        tronWeb.address.toHex(addressFrom)
      )

      sendTrx = transactionObject.transaction
    } catch {
      //
    }
  } else {
    sendTrx = await tronWeb.transactionBuilder.sendTrx(addressTo, value, addressFrom, 1)
  }

  if (sendTrx) {
    const signedtxn = await tronWeb.trx.sign(sendTrx, privateKey)
    const receipt = await tronWeb.trx.sendRawTransaction(signedtxn)

    if (receipt?.result) {
      return receipt.txid
    }
  }

  return null
}

export const validateAddress = (address: string): boolean => {
  try {
    return tronWeb.isAddress(address)
  } catch {
    return false
  }
}

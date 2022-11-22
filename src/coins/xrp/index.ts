import { RippleAPI } from 'ripple-lib'
import keypairs from 'ripple-keypairs'

// Utils
import { getNetworkFeeRequest, getTxParams } from '@utils/api'

// Types
import { TGenerateAddress, TCreateTxProps, TCurrencyConfig } from '@coins/types'
import { TPayment } from './types'
import { TFeeResponse } from '@utils/api/types'

const api = new RippleAPI()

export const config: TCurrencyConfig = {
  coins: ['xrp'],
  extraIdName: 'Destination tag',
  isGenerateExtraId: true,
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return +api.dropsToXrp(value)
  }

  return +api.xrpToDrops(value)
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const generate = api.generateAddress()

  if (generate?.address) {
    return {
      address: generate.address,
      privateKey: generate.secret,
    }
  }

  return null
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const keypair = keypairs.deriveKeypair(privateKey)

  return keypairs.deriveAddress(keypair.publicKey)
}

export const validateAddress = (address: string): boolean => {
  return api.isValidAddress(address)
}

export const getExplorerLink = (address: string): string => {
  return `https://xrpscan.com/account/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://xrpscan.com/tx/${hash}`
}

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  const { addressFrom, addressTo, amount, extraId, privateKey } = props

  if (!privateKey) {
    return null
  }

  const params = await getTxParams('ripple', addressFrom)

  if (params) {
    const { fee, sequence, maxLedgerVersion } = params

    const payment: TPayment = {
      source: {
        address: addressFrom,
        maxAmount: {
          value: amount,
          currency: 'XRP',
        },
      },
      destination: {
        address: addressTo,
        amount: {
          value: amount,
          currency: 'XRP',
        },
      },
    }

    if (extraId?.length) {
      payment.destination.tag = Number(extraId)
    }

    const { txJSON } = await api.preparePayment(addressFrom, payment, {
      fee,
      sequence,
      maxLedgerVersion,
    })

    const sign = api.sign(txJSON, privateKey)

    return sign.signedTransaction
  }

  return null
}

export const generateExtraId = (): string => {
  const num = (Date.now() * (1 + Math.random())).toFixed(0).slice(-9).split('')
  const firstSign = +num[0]
  if (firstSign === 0) {
    num[0] = Math.floor(1 + Math.random() * (9 + 1 - 1)).toString()
  }
  return num.join('')
}

export const getNetworkFee = async (): Promise<TFeeResponse | null> => {
  try {
    return await getNetworkFeeRequest('ripple')
  } catch {
    return null
  }
}

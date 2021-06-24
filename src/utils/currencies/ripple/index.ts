import { RippleAPI } from 'ripple-lib'
import keypairs from 'ripple-keypairs'

// Types
import { TTxParams, TPayment } from './types'

const api = new RippleAPI()

export const coins = ['xrp']
export const extraIdName = 'Destination tag'

export const fromXrp = (value: string | number): number => {
  return +api.dropsToXrp(value)
}

export const toXrp = (value: string | number): number => {
  return +api.xrpToDrops(value)
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const { address, secret: privateKey } = api.generateAddress()

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
    const keypair = keypairs.deriveKeypair(privateKey)

    return keypairs.deriveAddress(keypair.publicKey)
  } catch {
    return null
  }
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

export const createTransaction = async (
  from: string,
  to: string,
  value: string | number,
  privateKey: string,
  txParams: TTxParams,
  extraTo?: string
): Promise<string | null> => {
  try {
    const { fee, sequence, maxLedgerVersion } = txParams
    const parseValue = fromXrp(value)

    const payment: TPayment = {
      source: {
        address: from,
        maxAmount: {
          value: `${parseValue}`,
          currency: 'XRP',
        },
      },
      destination: {
        address: to,
        amount: {
          value: `${parseValue}`,
          currency: 'XRP',
        },
      },
    }

    if (extraTo?.length) {
      payment.destination.tag = Number(extraTo)
    }

    const { txJSON } = await api.preparePayment(from, payment, {
      fee,
      sequence,
      maxLedgerVersion,
    })

    const sign = api.sign(txJSON, privateKey)

    return sign.signedTransaction
  } catch {
    return null
  }
}

export const generateTag = (): string => {
  const num = (Date.now() * (1 + Math.random())).toFixed(0).slice(-9).split('')
  const firstSign = +num[0]
  if (firstSign === 0) {
    num[0] = Math.floor(1 + Math.random() * (9 + 1 - 1)).toString()
  }
  return num.join('')
}

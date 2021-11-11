import * as Devkit from 'thor-devkit'
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'

// Utils
import { getBalance } from '@utils/api'

// Types
import { TGetFeeData } from '../types'

const ten18 = new BigNumber(10).pow(18)

export const coins: string[] = ['vet', 'vtho']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privKey = Devkit.secp256k1.generatePrivateKey()
    const pubKey = Devkit.secp256k1.derivePublicKey(privKey)
    const address = Devkit.address.fromPublicKey(pubKey)

    return {
      privateKey: privKey.toString('hex'),
      address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const pubKey = Devkit.secp256k1.derivePublicKey(Buffer.from(privateKey, 'hex'))

    return Devkit.address.fromPublicKey(pubKey)
  } catch {
    return null
  }
}
export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten18))
  }

  return Number(new BigNumber(value).multipliedBy(ten18))
}

export const getExplorerLink = (address: string): string => {
  return `https://explore.vechain.org/accounts/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explore.vechain.org/transactions/${hash}#info`
}

export const getNetworkFee = async (
  from: string,
  to: string,
  amount: string
): Promise<TGetFeeData> => {
  try {
    const balanceRequest = await getBalance(from, 'vechain')

    return {
      networkFee: 0.21,
      currencyBalance: balanceRequest.balance,
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const createTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  privateKey: string
): Promise<string | null> => {
  try {
    console.log('XXX', +formatValue(amount, 'to'))
    const clauses = [
      {
        to: toAddress,
        value: 1000000000,
        data: '0x',
      },
    ]

    const tx = new Devkit.Transaction({
      chainTag: 0x9a,
      blockRef: '0x0000000000000000',
      expiration: 32,
      clauses: clauses,
      gasPriceCoef: 128,
      gas: Devkit.Transaction.intrinsicGas(clauses),
      dependsOn: null,
      nonce: 12345678,
    })
    const signingHash = tx.signingHash()
    tx.signature = Devkit.secp256k1.sign(signingHash, Buffer.from(privateKey, 'hex'))

    return `0x${tx.encode().toString('hex')}`
  } catch {
    return null
  }
}

import { Transaction, secp256k1, keccak256, address } from 'thor-devkit'
import { thorify } from "thorify";
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import { TInternalTxProps } from 'utils/currencies/types'

export const coins: string[] = ['vet', 'vtho']



export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privKey = secp256k1.generatePrivateKey()
    const pubKey = secp256k1.derivePublicKey(privKey)
    const addr = address.fromPublicKey(pubKey)

    return {
      privateKey: privKey.toString('hex'),
      address: addr
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {

    const pubKey = secp256k1.derivePublicKey(Buffer.from(privateKey, 'hex'))

    return address.fromPublicKey(pubKey)
  } catch {
    return null
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {

  }

  return 0
}


export const getExplorerLink = (address: string): string => {
  return `https://explore.vechain.org/accounts/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explore.vechain.org/accounts/${hash}` // todo
}

// export const validateAddress = (address: string): boolean => {
//   try {
//
// // ?
//
//     return null
//   } catch {
//     return false
//   }
// }

// ************************** CreateTx

export const createTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  privateKey: string
): Promise<string | null> => {
  try {
    const clauses =  [{
      to: toAddress,
      value: amount,
      data: '0x'
    }]

    const gas = Transaction.intrinsicGas(clauses)

    let body: Transaction.Body = {
      chainTag: 0x9a,
      blockRef: '0x0000000000000000',
      expiration: 32,
      clauses: clauses,
      gasPriceCoef: 128,
      gas,
      dependsOn: null,
      nonce: 12345678 // todo
    }

    const tx = new Transaction(body)
    const signingHash = tx.signingHash()
    tx.signature = secp256k1.sign(signingHash, Buffer.from(privateKey, 'hex')) // todo

    return tx.encode().toString('hex')
  } catch {
    return null
  }
}


// const raw = tx.encode()
// const decoded = Transaction.decode(raw)


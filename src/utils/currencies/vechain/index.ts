import { Transaction, secp256k1, keccak256, address } from 'thor-devkit'
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import { TInternalTxProps } from 'utils/currencies/types'
import thetajs from '@thetalabs/theta-js'

export const coins: string[] = ['vet']



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

export const validateAddress = (address: string): boolean => {
  try {

// no need?

    return
  } catch {
    return false
  }
}

// ************************** CreateTx

const clauses =  [{
  to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
  value: 10000,
  data: '0x'
}]

// calc intrinsic gas
const gas = Transaction.intrinsicGas(clauses)
console.log(gas)
// 21000

let body: Transaction.Body = {
  chainTag: 0x9a,
  blockRef: '0x0000000000000000',
  expiration: 32,
  clauses: clauses,
  gasPriceCoef: 128,
  gas,
  dependsOn: null,
  nonce: 12345678
}

const tx = new Transaction(body)
const signingHash = tx.signingHash()
tx.signature = secp256k1.sign(signingHash, /* your private key */)

const raw = tx.encode()
const decoded = Transaction.decode(raw)

// *******************************

export const createInternalTx = async (
  { symbol,
    addressFrom,
    addressTo,
    amount,
    privateKey
  }: TInternalTxProps): Promise<string | null> => {
  try {
    const thetaWeiToSend =
      symbol === 'theta' ? new BigNumber(amount).multipliedBy(ten18) : new BigNumber(0)
    const tfuelWeiToSend =
      symbol === 'tfuel' ? new BigNumber(amount).multipliedBy(ten18) : new BigNumber(0)

    const transaction = new thetajs.transactions.SendTransaction({
      from: addressFrom,
      outputs: [
        {
          address: addressTo,
          thetaWei: thetaWeiToSend,
          tfuelWei: tfuelWeiToSend
        }
      ]
    })

    const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Mainnet)
    const wallet = new thetajs.Wallet(privateKey, provider)
    const result = await wallet.sendTransaction(transaction)

    if (result?.hash) {
      return result.hash
    }
    return null
  } catch {
    return null
  }
}
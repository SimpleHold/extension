import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import type Transport from '@ledgerhq/hw-transport-webusb'
import { Transaction } from '@ethereumjs/tx'
import { encode } from 'ripple-binary-codec'

import BTCApp from '@ledgerhq/hw-app-btc'
import ETHApp from '@ledgerhq/hw-app-eth'
import XRPApp from '@ledgerhq/hw-app-xrp'

// Utils
import { toHex } from '@utils/web3'
import { toUpper } from '@utils/format'

export type TCurrency = {
  symbol: string
  path: string
}

interface ILedgerError {
  message: string
  name: string
  statusCode: number
  statusText: string
}

export const currencies: TCurrency[] = [
  {
    symbol: 'btc',
    path: "44'/0'/0'/0/",
  },
  {
    symbol: 'eth',
    path: "44'/60'/0'/0/",
  },
  {
    symbol: 'xrp',
    path: "44'/144'/0'/0/",
  },
]

export const requestTransport = async (): Promise<Transport | null> => {
  try {
    return await TransportWebUSB.request()
  } catch {
    return null
  }
}

export const getBTCAddress = async (
  index: number,
  transport: Transport
): Promise<string | ILedgerError> => {
  try {
    const { bitcoinAddress } = await new BTCApp(transport).getWalletPublicKey(
      `44'/0'/0'/0/${index}`
    )

    return bitcoinAddress
  } catch (err) {
    return err
  }
}

export const getETHAddress = async (
  index: number,
  transport: Transport
): Promise<string | ILedgerError> => {
  try {
    const { address } = await new ETHApp(transport).getAddress(`44'/60'/0'/0/${index}`)

    return address
  } catch (err) {
    return err
  }
}

export const getXRPAddress = async (
  index: number,
  transport: Transport
): Promise<string | ILedgerError> => {
  try {
    const { address } = await new XRPApp(transport).getAddress(`44'/144'/0'/0/${index}`)

    return address
  } catch (err) {
    return err
  }
}

export const ethLedgerSignTx = async (
  transport: Transport,
  path: string,
  gasPrice: string,
  gasLimit: number,
  to: string,
  value: number,
  nonce: number,
  chainId: number
): Promise<string | null | ILedgerError> => {
  try {
    const transaction = {
      to,
      value: toHex(value),
      chainId,
      nonce: toHex(nonce),
      gasLimit: toHex(gasLimit),
      gasPrice: toHex(Number(gasPrice)),
      v: '0x01',
      r: '0x00',
      s: '0x00',
    }

    const serializedTx = Transaction.fromTxData(transaction).serialize().toString('hex')

    const eth = new ETHApp(transport)
    const result = await eth.signTransaction(path, serializedTx)

    if (result) {
      transaction.v = `0x${result.v}`
      transaction.r = `0x${result.r}`
      transaction.s = `0x${result.s}`

      const signedTx = Transaction.fromTxData(transaction)

      return `0x${signedTx.serialize().toString('hex')}`
    }

    return null
  } catch (err) {
    return err
  }
}

export const createBtcTx = async (transport: Transport) => {
  try {
    const btc = new BTCApp(transport)

    const tx1 = btc.splitTransaction(
      '01000000014ea60aeac5252c14291d428915bd7ccd1bfc4af009f4d4dc57ae597ed0420b71010000008a47304402201f36a12c240dbf9e566bc04321050b1984cd6eaf6caee8f02bb0bfec08e3354b022012ee2aeadcbbfd1e92959f57c15c1c6debb757b798451b104665aa3010569b49014104090b15bde569386734abf2a2b99f9ca6a50656627e77de663ca7325702769986cf26cc9dd7fdea0af432c8e2becc867c932e1b9dd742f2a108997c2252e2bdebffffffff0281b72e00000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88aca0860100000000001976a9144533f5fb9b4817f713c48f0bfe96b9f50c476c9b88ac00000000'
    )

    const result = await btc.createPaymentTransactionNew({
      inputs: [[tx1, 1, undefined, undefined]],
      associatedKeysets: ["0'/0/0"],
      outputScriptHex: '01905f0100000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88ac',
      additionals: [],
    })

    console.log('result', result)
  } catch (err) {
    console.log('er', err)
    return null
  }
}

export const createXrpTx = async (
  transport: Transport,
  path: string,
  addressFrom: string,
  addressTo: string,
  amount: string,
  fee: string,
  sequence: number
) => {
  try {
    const xrp = new XRPApp(transport)

    const getAddress = await xrp.getAddress(path)

    if (getAddress) {
      const { publicKey } = getAddress

      const tx = {
        TransactionType: 'Payment',
        Account: addressFrom,
        Destination: addressTo,
        Amount: amount,
        Fee: fee,
        Flags: 0,
        Sequence: sequence,
        SigningPubKey: toUpper(publicKey),
      }

      const txBlob = encode(tx)

      const result = await xrp.signTransaction(path, txBlob)

      console.log('result', result)
    }
  } catch {
    return null
  }
}

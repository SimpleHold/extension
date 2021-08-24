import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import type Transport from '@ledgerhq/hw-transport-webusb'
import { Transaction } from '@ethereumjs/tx'
import { encode } from 'ripple-binary-codec'

import BTCApp from '@ledgerhq/hw-app-btc'
import ETHApp from '@ledgerhq/hw-app-eth'
import XRPApp from '@ledgerhq/hw-app-xrp'

// Utils
import { toHex } from '@utils/currencies/ethereumLike'
import { toUpper } from '@utils/format'
import { getXrpTxParams, getTxHex } from '@utils/api'
import { formatValue as formatXrpValue } from '@utils/currencies/ripple'

export type TCurrency = {
  symbol: string
  path: string
}

type TRippleTx = {
  TransactionType: string
  Account: string
  Destination: string
  Amount: string
  Fee: string
  Sequence: number
  SigningPubKey?: string
  DestinationTag?: string
}

export interface ILedgerError {
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

export const createBtcTx = async (
  transport: Transport,
  path: string,
  outputs: UnspentOutput[],
  addressFrom: string,
  addressTo: string,
  amount: number,
  fee: number
): Promise<string | null | ILedgerError> => {
  try {
    const btc = new BTCApp(transport)

    const inputs: any[] = []
    const associatedKeysets: string[] = []

    for (const output of outputs) {
      const { outputIndex, txId } = output
      const txHex = await getTxHex('bitcoin', txId)

      if (txHex) {
        const split = btc.splitTransaction(txHex)
        inputs.push([split, outputIndex, undefined, undefined])
        associatedKeysets.push(path)
      }
    }

    if (inputs.length !== outputs.length) {
      return null
    }

    const newTx = bitcoin.createUnsignedTx(outputs, addressTo, amount, fee, addressFrom)

    const splitNewTx = btc.splitTransaction(newTx)
    const outputScriptHex = btc.serializeTransactionOutputs(splitNewTx).toString('hex')

    return await btc.createPaymentTransactionNew({
      inputs,
      associatedKeysets,
      outputScriptHex,
      additionals: [],
    })
  } catch (err) {
    return err
  }
}

export const createXrpTx = async (
  transport: Transport,
  path: string,
  addressFrom: string,
  addressTo: string,
  amount: number,
  extraId?: string
): Promise<string | null | ILedgerError> => {
  try {
    const xrp = new XRPApp(transport)

    const getAddress = await xrp.getAddress(path)

    if (getAddress) {
      const { publicKey } = getAddress

      const txParams = await getXrpTxParams(addressFrom)

      if (txParams) {
        const { fee, sequence } = txParams

        const tx: TRippleTx = {
          TransactionType: 'Payment',
          Account: addressFrom,
          Destination: addressTo,
          Amount: `${amount}`,
          Fee: `${formatXrpValue(fee, 'to')}`,
          Sequence: sequence,
          SigningPubKey: toUpper(publicKey),
        }

        if (extraId?.length) {
          tx.DestinationTag = extraId
        }

        const signature = await xrp.signTransaction(path, encode(tx))

        if (signature) {
          return encode({
            ...tx,
            TxnSignature: signature,
          })
        }

        return null
      }
    }

    return null
  } catch (err) {
    return err
  }
}

export const getFirstAddress = async (
  transport: Transport,
  symbol: string
): Promise<string | ILedgerError> => {
  try {
    if (symbol === 'btc') {
      return await getBTCAddress(0, transport)
    } else if (symbol === 'eth') {
      return await getETHAddress(0, transport)
    } else {
      return await getXRPAddress(0, transport)
    }
  } catch (err) {
    return err
  }
}

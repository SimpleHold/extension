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
import { getXrpTxParams } from '@utils/api'
import { toXrp } from '@utils/currencies/ripple'

export type TCurrency = {
  symbol: string
  path: string
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

    const tx1 = btc.splitTransaction(
      '0200000001ea5bf693d7a9f2d80453cda13bff4f881bd9e8cdcdff0397c9f236f66800ca99010000006a473044022073da72fd4d3ec719a55d39ed9264a1c6f6b94bd13e1e4b0c108835da9171aec102204aabd799618aa35be5ee05d505fff5ca8bfcee6863beed8b59c0a71a88ab69a80121035236db538da0722dfa3c08d5e515ab4b94634275f29a4d36847382231130b203ffffffff0250c30000000000001976a914c1fada15b3b0c23c1df16275ee00687a59ac729988ac96450100000000001976a91429f07c264f890aeeb6abb54885965dff87330af188ac00000000'
    )

    const newTx = bitcoin.createUnsignedTx(outputs, addressTo, amount, fee, addressFrom)

    const splitNewTx = btc.splitTransaction(newTx)
    const outputScriptHex = btc.serializeTransactionOutputs(splitNewTx).toString('hex')

    return await btc.createPaymentTransactionNew({
      inputs: [[tx1, 0, undefined, undefined]],
      associatedKeysets: [path],
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
  amount: number
): Promise<string | null | ILedgerError> => {
  try {
    const xrp = new XRPApp(transport)

    const getAddress = await xrp.getAddress(path)

    if (getAddress) {
      const { publicKey } = getAddress

      const txParams = await getXrpTxParams(addressFrom)

      if (txParams) {
        const { fee, sequence } = txParams

        const tx = {
          TransactionType: 'Payment',
          Account: addressFrom,
          Destination: addressTo,
          Amount: `${amount}`,
          Fee: `${toXrp(fee)}`,
          Sequence: sequence,
          SigningPubKey: toUpper(publicKey),
        }

        return await xrp.signTransaction(path, encode(tx))
      }
    }

    return null
  } catch (err) {
    return err
  }
}

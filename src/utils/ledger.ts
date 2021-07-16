import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import type Transport from '@ledgerhq/hw-transport-webusb'
import { Transaction } from '@ethereumjs/tx'

import BTCApp from '@ledgerhq/hw-app-btc'
import ETHApp from '@ledgerhq/hw-app-eth'
import XRPApp from '@ledgerhq/hw-app-xrp'

// Utils
import { toHex } from '@utils/web3'

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
) => {
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
  } catch {
    return null
  }
}

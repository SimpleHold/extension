import TrezorConnect from 'trezor-connect'
import { Transaction } from '@ethereumjs/tx'

// Utils
import { toHex } from '@utils/web3'
import { sendRawTransaction } from '@utils/api'

export type TTrezorBundle = {
  path: string
  coin: string
  showOnTrezor: boolean
}

export const init = async (): Promise<void> => {
  try {
    await TrezorConnect.init({
      manifest: {
        email: 'support@simplehold.io',
        appUrl: 'https://simplehold.io/',
      },
    })
  } catch {}
}

export const getAddresses = async (
  bundle: TTrezorBundle[],
  symbol: string
): Promise<string[] | null> => {
  try {
    let request

    if (symbol === 'eth') {
      request = await TrezorConnect.ethereumGetAddress({
        bundle,
      })
    } else {
      request = await TrezorConnect.getAddress({
        bundle,
      })
    }

    if (request.success) {
      return request.payload.map((item) => item.address)
    }

    return null
  } catch {
    return null
  }
}

export const composeTransaction = async (
  amount: string,
  address: string,
  coin: string
): Promise<null | string> => {
  try {
    await init()

    const request = await TrezorConnect.composeTransaction({
      outputs: [
        {
          amount,
          address,
        },
      ],
      coin,
      push: true,
    })

    if (request.success) {
      if (request.payload.txid) {
        return request.payload.txid
      }
      return null
    }

    return null
  } catch {
    return null
  }
}

const getEthereumRawTx = (
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  v: string,
  r: string,
  s: string
): string | null => {
  try {
    const tx = Transaction.fromTxData({
      nonce,
      gasPrice,
      gasLimit,
      to,
      value,
      v,
      r,
      s,
    })

    return `0x${tx.serialize().toString('hex')}`
  } catch {
    return null
  }
}

export const ethereumSignTransaction = async (
  path: string,
  to: string,
  value: number,
  chainId: number,
  nonce: number,
  gasLimit: number,
  gasPrice: string
): Promise<string | null> => {
  try {
    await init()

    const getNonce = toHex(nonce)
    const getGasPrice = toHex(Number(gasPrice))
    const getGasLimit = toHex(gasLimit)
    const getValue = toHex(value)

    const request = await TrezorConnect.ethereumSignTransaction({
      path,
      transaction: {
        to,
        value: getValue,
        chainId,
        nonce: getNonce,
        gasLimit: getGasLimit,
        gasPrice: getGasPrice,
      },
    })

    if (request.success) {
      const { v, r, s } = request.payload

      const rawTx = getEthereumRawTx(getNonce, getGasPrice, getGasLimit, to, getValue, v, r, s)

      if (rawTx) {
        const send = await sendRawTransaction(rawTx, 'eth')
        return send
      }
    }

    return null
  } catch {
    return null
  }
}

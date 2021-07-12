import TrezorConnect, { TxInputType, TxOutputType } from 'trezor-connect'
import { Transaction } from '@ethereumjs/tx'

// Utils
import { toHex } from '@utils/web3'
import { sendRawTransaction } from '@utils/api'

export type TTrezorBundle = {
  path: string
  coin: string
  showOnTrezor: boolean
}

export type TTrezorCurrency = {
  symbol: string
  path: string
  numberPath: number[]
  index: number
}

export const currencies: TTrezorCurrency[] = [
  {
    symbol: 'btc',
    path: "m/49'/0'/0'/0/",
    numberPath: [2147483697, 2147483648, 2147483648, 0],
    index: 0,
  },
  {
    symbol: 'ltc',
    path: "m/49'/2'/0'/0/",
    numberPath: [2147483697, 2147483650, 2147483648, 0],
    index: 0,
  },
  {
    symbol: 'bch',
    path: "m/44'/145'/0'/0/",
    numberPath: [2147483692, 2147483793, 2147483648, 0],
    index: 0,
  },
  {
    symbol: 'dash',
    path: "m/44'/5'/0'/0/",
    numberPath: [2147483692, 2147483653, 2147483648, 0],
    index: 0,
  },
  {
    symbol: 'eth',
    path: "m/44'/60'/0'/0/",
    numberPath: [2147483692, 2147483708, 2147483648, 0],
    index: 0,
  },
]

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

export const pushTransaction = async (tx: string, coin: string): Promise<string | null> => {
  try {
    const request = await TrezorConnect.pushTransaction({
      tx,
      coin,
    })

    if (request.success) {
      return request.payload.txid
    }
    return null
  } catch {
    return null
  }
}

const getNumberPath = (path: string): number[] => {
  const findCurrency = currencies.find(
    (currency: TTrezorCurrency) => path.indexOf(currency.path) !== -1
  )
  const getLastPathIndex = Number(path.split('/')[path.split('/').length - 1])

  if (findCurrency) {
    return [...findCurrency.numberPath, getLastPathIndex]
  }
  return []
}

export const signTransaction = async (
  amount: string,
  addressTo: string,
  coin: string,
  outputs: UnspentOutput[],
  path: string,
  fee: number
): Promise<string | null> => {
  try {
    await init()

    const addressFromPath = getNumberPath(path)

    const mapInputs: TxInputType[] = outputs.map((output: UnspentOutput) => {
      return {
        address_n: addressFromPath,
        prev_index: output.outputIndex,
        prev_hash: output.txId,
        amount: `${output.satoshis}`,
        script_type: 'SPENDP2SHWITNESS',
      }
    })

    const getTotalOutputsSats = outputs.reduce(
      (a: number, b: UnspentOutput) => Number(b.satoshis) + a,
      0
    )

    const getReturnAmount = getTotalOutputsSats - Number(amount) - fee

    const getOutputs: TxOutputType[] = [
      {
        address_n: addressFromPath,
        amount: `${getReturnAmount}`,
        script_type: 'PAYTOP2SHWITNESS',
      },
      {
        address: addressTo,
        amount,
        script_type: 'PAYTOADDRESS',
      },
    ]

    const request = await TrezorConnect.signTransaction({
      inputs: mapInputs,
      outputs: getOutputs,
      coin,
      push: true,
    })

    if (request.success) {
      return request.payload.txid || null
    }

    return null
  } catch {
    return null
  }
}

const getEthereumRawTx = (
  to: string,
  value: string,
  nonce: string,
  gasLimit: string,
  gasPrice: string,
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
  gasPrice: number
): Promise<string | null> => {
  try {
    await init()

    const transaction = {
      to,
      value: toHex(value),
      chainId,
      nonce: toHex(nonce),
      gasLimit: toHex(gasLimit),
      gasPrice: toHex(gasPrice),
    }

    const request = await TrezorConnect.ethereumSignTransaction({
      path,
      transaction,
    })

    if (request.success) {
      const { v, r, s } = request.payload

      const rawTx = getEthereumRawTx(
        to,
        toHex(value),
        toHex(nonce),
        toHex(gasLimit),
        toHex(gasPrice),
        v,
        r,
        s
      )

      if (rawTx) {
        return await sendRawTransaction(rawTx, 'eth', 'trezor')
      }
    }

    return null
  } catch {
    return null
  }
}

import TrezorConnect, { TxInputType, TxOutputType } from 'trezor-connect'

export type TTrezorBundle = {
  path: string
  coin: string
  showOnTrezor: boolean
}

export const init = async (): Promise<void> => {
  await TrezorConnect.init({
    manifest: {
      email: 'support@simplehold.io',
      appUrl: 'https://simplehold.io/',
    },
  })
}

export const getAddresses = async (bundle: TTrezorBundle[]): Promise<string[] | null> => {
  try {
    const request = await TrezorConnect.getAddress({
      bundle,
    })

    if (request.success) {
      return request.payload.map((item) => item.address)
    }

    return null
  } catch {
    return null
  }
}

export const signTransaction = async (
  inputs: TxInputType[],
  outputs: TxOutputType[],
  coin: string
): Promise<null | string> => {
  try {
    const request = await TrezorConnect.signTransaction({
      inputs,
      outputs,
      coin,
    })

    if (request.success) {
      return request.payload.serializedTx
    }
    return null
  } catch {
    return null
  }
}

export const pushTx = async (tx: string, coin: string): Promise<null | string> => {
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

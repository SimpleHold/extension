import TrezorConnect from 'trezor-connect'

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

export const getLabel = async (): Promise<string | null> => {
  try {
    const getFeatures = await TrezorConnect.getFeatures({ keepSession: true })

    if (getFeatures.success) {
      const {
        payload: { label = null },
      } = getFeatures

      return label
    }
    return null
  } catch {
    return null
  }
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

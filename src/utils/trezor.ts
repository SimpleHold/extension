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
    try {
      await init()
    } catch {}

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

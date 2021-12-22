import amplitudeSDK from 'amplitude-js'

// Utils
import { getItem } from '@utils/storage'
import { validateWallet } from '@utils/validate'
import { parseWalletsData } from '@utils/wallet'

interface IEvent {
  name: string
  properties?: { [key: string]: string | number }
}

export const init = (apiKey: string, clientId: string) => {
  amplitudeSDK.getInstance().init(apiKey, clientId)
}

export const logEvent = ({ name, properties = {} }: IEvent) => {
  properties = {
    ...properties,
    ...{
      ID_CLIENT: getItem('clientId') || '',
      TIME: new Date().toString(),
    },
  }
  setUserAddressesProperties()
  amplitudeSDK.getInstance().logEvent(name, properties)
}

export const setUserProperties = (properties: { [key: string]: any } = {}) => {
  amplitudeSDK.getInstance().setUserProperties({
    ...properties,
    ID_CLIENT: getItem('clientId'),
  })
}

export const setUserAddressesProperties = () => {
  const wallets = getItem('wallets')
  const validateWallets = validateWallet(wallets)

  if (validateWallets) {
    const walletsData = parseWalletsData(wallets)
    setUserProperties(walletsData)
  }
}
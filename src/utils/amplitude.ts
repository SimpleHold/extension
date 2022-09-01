import amplitudeSDK from 'amplitude-js'

// Config
import config from "@config/index"
import { ERROR_CREATE_TX, ERROR_GENERATE_ADDRESS, ERROR_IMPORT_PRIVATE_KEY } from '@config/events'

// Utils
import { getItem } from '@utils/storage'
import { validateWallet } from '@utils/validate'
import { parseWalletsData } from '@utils/wallet'

interface IEvent {
  name: string
  properties?: { [key: string]: string | number }
}

const isDisabled = config.isDevMode

export const init = (apiKey: string, clientId: string) => {
  if (isDisabled) return;
  amplitudeSDK.getInstance().init(apiKey, clientId)
}

export const logEvent = ({ name, properties = {} }: IEvent) => {
  if (isDisabled) return;
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


// Log errors
export const logErrorCreateTx = (
  error: string,
  symbol: string,
  tokenChain?: string,
) => {

  const properties = {
    error,
    symbol,
    ...(tokenChain && {tokenChain})
  }

  logEvent({
    name: ERROR_CREATE_TX,
    properties
  })
}

export const logErrorGenerateAddress = (
  error: string,
  symbol: string,
  chain?: string,
) => {

  const properties = {
    error,
    symbol,
    ...(chain && {chain})
  }

  logEvent({
    name: ERROR_GENERATE_ADDRESS,
    properties
  })
}

export const logErrorImportPrivateKey = (
  error: string,
  symbol: string,
  chain?: string,
) => {

  const properties = {
    error,
    symbol,
    ...(chain && {chain})
  }

  logEvent({
    name: ERROR_IMPORT_PRIVATE_KEY,
    properties
  })
}

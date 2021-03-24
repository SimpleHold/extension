import amplitudeSDK from 'amplitude-js'
import { v4 } from 'uuid'

interface IEvent {
  name: string
  properties?: { [key: string]: string }
}

const getClientId = (): string => {
  const getClientId = localStorage.getItem('clientId')

  if (getClientId) {
    return getClientId
  }
  return v4()
}

export const init = (apiKey: string) => {
  amplitudeSDK.getInstance().init(apiKey, getClientId())
}

export const logEvent = ({ name, properties = {} }: IEvent) => {
  properties = {
    ...properties,
    ...{
      ID_CLIENT: localStorage.getItem('clientId') || '',
      TIME: new Date().toString(),
    },
  }

  amplitudeSDK.getInstance().logEvent(name, properties)
}

export const setUserProperties = (properties: { [key: string]: string } = {}) => {
  amplitudeSDK.getInstance().setUserProperties({
    ...properties,
    ID_CLIENT: getClientId(),
  })
}

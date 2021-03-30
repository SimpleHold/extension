import amplitudeSDK from 'amplitude-js'

interface IEvent {
  name: string
  properties?: { [key: string]: string }
}

export const init = (apiKey: string, clientId: string) => {
  amplitudeSDK.getInstance().init(apiKey, clientId)
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
    ID_CLIENT: localStorage.getItem('clientId'),
  })
}

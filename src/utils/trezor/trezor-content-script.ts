import { browser, Runtime } from 'webextension-polyfill-ts'

let port: Runtime.Port | null = browser.runtime.connect(undefined, { name: 'trezor-connect' })

port.onMessage.addListener((message) => {
  window.postMessage(message, window.location.origin)
})

port.onDisconnect.addListener(() => {
  port = null
})

window.addEventListener('message', (event) => {
  if (port && event.source === window && event.data) {
    port.postMessage({ data: event.data })
  }
})

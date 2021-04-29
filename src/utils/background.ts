import { browser } from 'webextension-polyfill-ts'

export interface IRequest {
  type: string
  data?: any
}

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    const { data: { inputId = undefined } = {} } = request

    if (inputId) {
      const { screenX, outerWidth } = window

      browser.windows.create({
        url: 'select-address.html',
        type: 'popup',
        width: 375,
        height: 700,
        left: Math.max(screenX + (outerWidth - 375), 0),
        top: 0,
      })
    }
  }

  if (request.type === 'set_address') {
    const tabs = await browser.tabs.query({ active: true })

    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, request)
    }
  }
})

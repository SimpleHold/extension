import { browser } from 'webextension-polyfill-ts'
import { IRequest } from 'utils/browser/types'

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    const { screenX, screenY, outerWidth, site, favicon } = request.data

    localStorage.setItem('requesterSite', JSON.stringify({ url: site, favicon }))

    browser.windows.create({
      url: 'select-address.html',
      type: 'popup',
      width: 375,
      height: 700,
      left: Math.max(screenX + (outerWidth - 375), 0),
      top: screenY,
    })
  }

  if (request.type === 'set_address') {
    const tabs = await browser.tabs.query({ active: true })

    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, request)
    }
  }
})

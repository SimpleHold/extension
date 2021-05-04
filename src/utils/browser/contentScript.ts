import { browser } from 'webextension-polyfill-ts'
import { IRequest } from 'utils/browser/types'

const setSHAttribute = () => {
  document.documentElement.setAttribute('sh-ex-status', 'installed')
}

const injectScript = () => {
  const container = document.head || document.documentElement
  const s = document.createElement('script')
  s.src = browser.runtime.getURL('js/inpage.bundle.js')

  container.appendChild(s)
}

injectScript()
setSHAttribute()

browser.runtime.onMessage.addListener((request: IRequest) => {
  if (request.type === 'set_address') {
    const { data } = request
    const findInput = document.querySelector<HTMLInputElement>(
      "[sh-input='address']"
    ) as HTMLInputElement

    if (findInput && data?.address) {
      document.dispatchEvent(
        new CustomEvent('sh-select-address', {
          detail: {
            address: data.address,
          },
        })
      )
    }
  }
})

document.addEventListener('request_addresses', (request: IRequest) => {
  if (request.type === 'request_addresses') {
    const { site, favicon } = request.detail
    const { screenX, screenY, outerWidth } = window

    browser.runtime.sendMessage({
      type: 'request_addresses',
      data: {
        screenX,
        screenY,
        outerWidth,
        site,
        favicon,
      },
    })
  }
})

import { browser } from 'webextension-polyfill-ts'
import copy from 'copy-to-clipboard'

// utils
import { IRequest } from '@utils/browser/types'

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

    if (data?.address) {
      if (findInput) {
        document.dispatchEvent(
          new CustomEvent('sh-select-address', {
            detail: {
              address: data.address,
            },
          })
        )
      } else {
        copy(data.address)
        document.execCommand('paste')
      }
    }
  } else if (request.type === 'context-menu-address') {
    const { data } = request

    copy(data.address)
    document.execCommand('paste')
  }
})

document.addEventListener('request_addresses', (request: IRequest) => {
  if (request.type === 'request_addresses') {
    const { site, favicon } = request.detail
    const { screenX, screenY, outerWidth } = window

    const currency = document.getElementById('sh-button')?.getAttribute('sh-currency')
    const chain = document.getElementById('sh-button')?.getAttribute('sh-currency-chain')

    browser.runtime.sendMessage({
      type: 'request_addresses',
      data: {
        screenX,
        screenY,
        outerWidth,
        site,
        favicon,
        currency,
        chain,
      },
    })
  }
})

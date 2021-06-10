import { browser } from 'webextension-polyfill-ts'
import copy from 'copy-to-clipboard'

// Utils
import { IRequest } from '@utils/browser/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const setSHAttribute = async () => {
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

let activeRequest: string | null

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'set_address') {
    const { data } = request

    const findInput = document.querySelector<HTMLInputElement>(
      "[sh-input='address']"
    ) as HTMLInputElement

    if (data?.address) {
      copy(data.address)

      if (findInput) {
        findInput.focus()
        document.execCommand('selectAll')
        document.execCommand('delete')
      }

      document.execCommand('paste')
      document.execCommand('selectAll')
      document.execCommand('delete')
      document.execCommand('paste')
    }
  } else if (request.type === 'context-menu-address') {
    const { data } = request

    copy(data.address)
    document.execCommand('paste')
  }
})

document.addEventListener('request_addresses', async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    if (activeRequest === request.type) {
      return
    }
    activeRequest = request.type

    const { screenX, screenY, outerWidth } = window

    const currency = document.getElementById('sh-button')?.getAttribute('sh-currency')
    const chain = document.getElementById('sh-button')?.getAttribute('sh-currency-chain')

    await browser.runtime.sendMessage({
      type: 'request_addresses',
      data: {
        screenX,
        screenY,
        outerWidth,
        currency,
        chain,
      },
    })

    activeRequest = null
  }
})

document.addEventListener('request_send', async (request: IRequest) => {
  if (activeRequest === request.type) {
    return
  }
  activeRequest = request.type

  const { readOnly, currency, amount, recipientAddress, chain, extraId } = request.detail
  const { screenX, screenY, outerWidth } = window

  await browser.runtime.sendMessage({
    type: 'request_send',
    data: {
      screenX,
      screenY,
      outerWidth,
      readOnly,
      currency,
      amount,
      recipientAddress,
      chain,
      extraId,
    },
  })

  activeRequest = null
})

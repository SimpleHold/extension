import { browser } from 'webextension-polyfill-ts'
import copy from 'copy-to-clipboard'

// Utils
import { IRequest } from '@utils/browser/types'

const setSHAttribute = async () => {
  document.documentElement.setAttribute('sh-ex-status', 'installed')
}

const addCustomEventListener = (selector: string, event: any, handler: Function) => {
  const rootElement = document.querySelector<HTMLBodyElement>('body')
  if (rootElement) {
    rootElement.addEventListener(
      event,
      (evt) => {
        let targetElement = evt.target

        while (targetElement != null) {
          if (targetElement.matches(selector)) {
            handler(evt)
            return
          }
          targetElement = targetElement.parentElement
        }
      },
      true
    )
  }
}

addCustomEventListener('#sh-button', 'click', () => {
  const findInput = document.querySelector<HTMLInputElement>("[sh-input='address']")

  if (findInput && !window.screenTop && !window.screenY) {
    const currency = document.getElementById('sh-button')?.getAttribute('sh-currency')
    const chain = document.getElementById('sh-button')?.getAttribute('sh-currency-chain')

    const iframeContainer = document.createElement('div')
    const iframe = document.createElement('iframe')

    iframeContainer.id = 'sh-iframe'

    const { screenX, outerWidth } = window

    iframeContainer.style.width = '375px'
    iframeContainer.style.height = '700px'
    iframeContainer.style.position = 'fixed'
    iframeContainer.style.left = `${Math.max(screenX + (outerWidth - 375), 0)}px`
    iframeContainer.style.top = '0'
    iframeContainer.style.zIndex = '100'
    iframeContainer.style.borderRadius = '16px'
    iframeContainer.style.filter = 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.5))'

    iframe.style.width = '375px'
    iframe.style.height = '700px'
    iframe.style.border = 'none'
    iframe.style.borderRadius = '16px'

    iframe.src = browser.extension.getURL(
      `select-address.html?currency=${currency}&chain=${chain}&isDraggable=true`
    )

    iframeContainer.appendChild(iframe)

    document.body.insertBefore(iframeContainer, document.body.firstChild)
  }
})

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

      const findIframe = document.getElementById('sh-iframe')

      if (findIframe) {
        findIframe.parentNode?.removeChild(findIframe)
      }
    }
  } else if (request.type === 'context-menu-address') {
    const { data } = request

    copy(data.address)
    document.execCommand('paste')
  } else if (request.type === 'close_select_address_window') {
    const findIframe = document.getElementById('sh-iframe')

    if (findIframe) {
      findIframe.parentNode?.removeChild(findIframe)
    }
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

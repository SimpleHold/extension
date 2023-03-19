import browser from 'webextension-polyfill'
import copy from 'copy-to-clipboard'
import qs from 'query-string'

// Utils
import { IRequest } from '@utils/browser/types'
import { detectBrowser } from '@utils/detect'
import { isFullScreen } from '@utils/window'
import { openAppInNewWindow } from '@utils/extension';

let initialScreenX: number = 0
let initialScreenY: number = 0
let initialLeft: number = 0
let initialTop: number = 0
let isDraggableActive: boolean = false
let activeRequest: string | null

const setSHAttribute = async () => {
  if (!browser.extension.inIncognitoContext) {
    document.documentElement.setAttribute('sh-ex-status', 'installed')
  }
}

const executeScripts = async (): Promise<void> => {
  const container = document.head || document.documentElement
  const s = document.createElement('script')
  s.src = browser.runtime.getURL('inpage.js')

  container.appendChild(s)
}

setSHAttribute()
executeScripts()

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

const removeIframe = () => {
  const findIframe = document.getElementById('sh-iframe')

  if (findIframe) {
    findIframe.parentNode?.removeChild(findIframe)
  }
}

const createIframe = async (src: string) => {
  removeIframe()

  await browser.runtime.sendMessage({
    type: 'remove_window',
  })

  await browser.runtime.sendMessage({
    type: 'save_tab_info',
  })

  const iframe = document.createElement('iframe')

  iframe.id = 'sh-iframe'

  const { screenX, outerWidth } = window

  const leftDif = detectBrowser() === 'opera' ? 40 : 0

  iframe.style.width = '375px'
  iframe.style.height = '700px'
  iframe.style.position = 'absolute'
  iframe.style.left =
    screenX < 0
      ? `${outerWidth - 375}px`
      : `${Math.max(screenX + (outerWidth - leftDif - 375), 0)}px`
  iframe.style.top = `${document.documentElement.scrollTop}px`
  iframe.style.zIndex = '9999999999'
  iframe.style.borderRadius = '16px'
  iframe.style.filter = 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.5))'
  iframe.style.border = 'none'

  iframe.src = browser.runtime.getURL(src)

  document.body.insertBefore(iframe, document.body.firstChild)
}

addCustomEventListener('#sh-button', 'click', async () => {
  const findInput = document.querySelector<HTMLInputElement>("[sh-input='address']")

  if (findInput && isFullScreen()) {
    const getButton = document.getElementById('sh-button')

    const currency = getButton?.getAttribute('sh-currency')
    const chain = getButton?.getAttribute('sh-currency-chain')

    const params = qs.stringify({
      currency,
      chain,
      isDraggable: true,
    })

    await openAppInNewWindow(`select-address.html?${params}`)
  }
})

addCustomEventListener('#sh-send-button', 'click', async () => {
  const getButton = document.getElementById('sh-send-button')

  if (getButton && isFullScreen()) {
    const readOnly = getButton?.getAttribute('sh-read-only')
    const currency = getButton?.getAttribute('sh-currency')
    const amount = getButton?.getAttribute('sh-amount')
    const recipientAddress = getButton?.getAttribute('sh-recipient-address')
    const chain = getButton?.getAttribute('sh-chain')
    const extraId = getButton?.getAttribute('sh-extra-id')

    await browser.runtime.sendMessage({
      type: 'save_send_params',
      data: {
        readOnly,
        currency,
        amount,
        recipientAddress,
        chain,
        extraId,
      },
    })

    await openAppInNewWindow(`send.html?isDraggable=true`)
  }
})

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

      removeIframe()
    }
  } else if (request.type === 'context-menu-address') {
    const { data } = request

    copy(data.address)
    document.execCommand('paste')
  } else if (request.type === 'initial_drag_positions') {
    const { screenX, screenY } = request.data
    const findIframe = document.getElementById('sh-iframe')

    if (findIframe) {
      initialScreenX = screenX
      initialScreenY = screenY

      initialLeft = parseInt(findIframe.style.left)
      initialTop = parseInt(findIframe.style.top)
    }
  } else if (request.type === 'set_drag_active') {
    const { isActive } = request.data
    isDraggableActive = isActive
  } else if (request.type === 'drag') {
    if (!isDraggableActive) return

    const { screenX, screenY } = request.data
    const deltaX = screenX - initialScreenX
    const deltaY = screenY - initialScreenY

    const findIframe = document.getElementById('sh-iframe')
    if (findIframe) {
      findIframe.style.left = initialLeft + deltaX + 'px'
      findIframe.style.top = initialTop + deltaY + 'px'
    }
  } else if (request.type === 'set_iframe_focus') {
    document.getElementById('sh-iframe')?.focus()
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

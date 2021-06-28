import { browser } from 'webextension-polyfill-ts'
import copy from 'copy-to-clipboard'

// Utils
import { IRequest } from '@utils/browser/types'
import { setItem } from '@utils/storage'

let initialScreenX: number = 0
let initialScreenY: number = 0
let initialLeft: number = 0
let initialTop: number = 0
let isDraggableActive: boolean = false

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

  iframe.style.width = '375px'
  iframe.style.height = '700px'
  iframe.style.position = 'absolute'
  iframe.style.left = `${Math.max(screenX + (outerWidth - 375), 0)}px`
  iframe.style.top = '0'
  iframe.style.zIndex = '100'
  iframe.style.borderRadius = '16px'
  iframe.style.filter = 'drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.5))'
  iframe.style.border = 'none'

  iframe.src = browser.extension.getURL(src)

  document.body.insertBefore(iframe, document.body.firstChild)
}

addCustomEventListener('#sh-button', 'click', async () => {
  const findInput = document.querySelector<HTMLInputElement>("[sh-input='address']")

  if (findInput && !window.screenTop && !window.screenY) {
    const getButton = document.getElementById('sh-button')

    const currency = getButton?.getAttribute('sh-currency')
    const chain = getButton?.getAttribute('sh-currency-chain')

    await createIframe(`select-address.html?currency=${currency}&chain=${chain}&isDraggable=true`)
  }
})

addCustomEventListener('#sh-send-button', 'click', async () => {
  if (!window.screenTop && !window.screenY) {
    const getButton = document.getElementById('sh-send-button')

    const readOnly = getButton?.getAttribute('sh-read-only')
    const currency = getButton?.getAttribute('sh-currency')
    const amount = getButton?.getAttribute('sh-amount')
    const recipientAddress = getButton?.getAttribute('sh-recipient-address')
    const chain = getButton?.getAttribute('sh-chain')
    const extraId = getButton?.getAttribute('sh-extra-id')

    setItem(
      'sendPageProps',
      JSON.stringify({ readOnly, currency, amount, recipientAddress, chain, extraId })
    )

    await createIframe('send.html?isDraggable=true')
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

      removeIframe()
    }
  } else if (request.type === 'context-menu-address') {
    const { data } = request

    copy(data.address)
    document.execCommand('paste')
  } else if (request.type === 'close_select_address_window') {
    removeIframe()
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

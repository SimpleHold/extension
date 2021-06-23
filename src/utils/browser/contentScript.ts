import { browser } from 'webextension-polyfill-ts'
import copy from 'copy-to-clipboard'

// Utils
import { IRequest } from '@utils/browser/types'

let currentXPosition: number = 0
let currentYPosition: number = 0
let initialXPosition: number = 0
let initialYPosition: number = 0
let xOffset: number = 0
let yOffset: number = 0
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

addCustomEventListener('#sh-button', 'click', async () => {
  const findInput = document.querySelector<HTMLInputElement>("[sh-input='address']")

  if (findInput && !window.screenTop && !window.screenY) {
    removeIframe()

    await browser.runtime.sendMessage({
      type: 'save_tab_info',
    })

    const currency = document.getElementById('sh-button')?.getAttribute('sh-currency')
    const chain = document.getElementById('sh-button')?.getAttribute('sh-currency-chain')

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

    iframe.src = browser.extension.getURL(
      `select-address.html?currency=${currency}&chain=${chain}&isDraggable=true`
    )

    document.body.insertBefore(iframe, document.body.firstChild)
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
    const { clientX, clientY } = request.data

    initialXPosition = clientX - xOffset
    initialYPosition = clientY - yOffset
  } else if (request.type === 'set_drag_active') {
    const { isActive } = request.data

    isDraggableActive = isActive

    if (!isActive) {
      initialXPosition = currentXPosition
      initialYPosition = currentYPosition
    }
  } else if (request.type === 'drag') {
    const { clientX, clientY } = request.data

    if (isDraggableActive) {
      currentXPosition = clientX - initialXPosition
      currentYPosition = clientY - initialYPosition

      xOffset = clientX
      yOffset = clientY

      const findIframe = document.getElementById('sh-iframe')

      if (findIframe) {
        findIframe.style.transform =
          'translate3d(' + currentXPosition + 'px, ' + currentYPosition + 'px, 0)'
      }
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

import { IRequest } from './types'

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

  const getFavicon = (): string | null | undefined => {
    let favicon = undefined
    const nodeLinks = document.getElementsByTagName('link')

    for (const link of nodeLinks) {
      if (link.getAttribute('rel') === 'icon' || link.getAttribute('rel') === 'shortcut icon') {
        favicon = link.getAttribute('href')
      }
    }

    return favicon
  }

  if (findInput) {
    const favicon = getFavicon()

    document.dispatchEvent(
      new CustomEvent('request_addresses', {
        detail: {
          site: location.host,
          favicon,
        },
      })
    )
  }
})

document.addEventListener('request_send', (request: IRequest) => {
  const { detail } = request

  document.dispatchEvent(
    new CustomEvent('request_send_screen', {
      detail,
    })
  )
})

export {}

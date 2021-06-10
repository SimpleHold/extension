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

  if (findInput) {
    document.dispatchEvent(new CustomEvent('request_addresses'))
  }
})

addCustomEventListener('#sh-send-button', 'click', () => {
  const button = <HTMLDivElement>document.getElementById('sh-send-button')

  document.dispatchEvent(
    new CustomEvent('request_send', {
      detail: {
        readOnly: button.getAttribute('sh-read-only'),
        currency: button.getAttribute('sh-currency'),
        amount: button.getAttribute('sh-amount'),
        recipientAddress: button.getAttribute('sh-recipient-address'),
        chain: button.getAttribute('sh-chain'),
        extraId: button.getAttribute('sh-extra-id'),
      },
    })
  )
})

export {}

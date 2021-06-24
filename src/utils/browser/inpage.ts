import currencies, { ICurrency } from '@config/currencies'
import tokens, { IToken } from '@config/tokens'

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
    if (!window.screenTop && !window.screenY) {
      return
    } else {
      document.dispatchEvent(new CustomEvent('request_addresses'))
    }
  }
})

addCustomEventListener('#sh-send-button', 'click', () => {
  const button = <HTMLDivElement>document.getElementById('sh-send-button')

  if (!window.screenTop && !window.screenY) {
    return
  } else {
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
  }
})

const mapCurrencies = currencies.map((currency: ICurrency) => {
  const { symbol, background } = currency

  return {
    symbol,
    background,
    type: 'currency',
    logo: `https://simplehold.io/static/currencies/${symbol}.svg`,
  }
})

const mapTokens = tokens.map((token: IToken) => {
  const { symbol, background, chain } = token

  return {
    symbol,
    background,
    type: 'token',
    chain,
    logo: `https://simplehold.io/static/tokens/${symbol}.svg`,
  }
})

const actualCode = `var shCurrencies = ${JSON.stringify([...mapCurrencies, ...mapTokens])};
`

const script = document.createElement('script')
script.textContent = actualCode
document.body.appendChild(script)

export {}

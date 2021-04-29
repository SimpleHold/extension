import { browser } from 'webextension-polyfill-ts'

export interface IRequest {
  type: string
  data?: any
}

document.getElementById('simpleHoldButton')?.addEventListener('click', async () => {
  browser.runtime.sendMessage({
    type: 'request_addresses',
    data: {
      inputId: 'myinput',
    },
  })
})

browser.runtime.onMessage.addListener((request: IRequest) => {
  if (request.type === 'set_address') {
    const { data } = request

    const input = document.getElementById('myinput') as HTMLInputElement

    if (input && data?.address) {
      input.value = data.address
    }
  }
})

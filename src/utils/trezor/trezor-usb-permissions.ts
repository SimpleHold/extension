import { browser } from 'webextension-polyfill-ts'

const switchToPopupTab = async (event?: Event) => {
  window.removeEventListener('beforeunload', switchToPopupTab)

  if (!event) {
    const current = await browser.tabs.query({
      currentWindow: true,
      active: true,
    })

    if (current.length < 0) {
      return
    }

    const popup = await browser.tabs.query({
      index: current[0].index - 1,
    })

    if (popup.length < 0) {
      return
    }

    await browser.tabs.update(popup[0].id, { active: true })

    return
  }

  const tabs = await browser.tabs.query({
    url: '*://connect.trezor.io/*/popup.html',
  })

  if (tabs.length < 0) {
    return
  }

  await browser.tabs.update(tabs[0].id, { active: true })
}

window.addEventListener('message', (event) => {
  if (event.data === 'usb-permissions-init') {
    const iframe = document.getElementById('trezor-usb-permissions')
    if (iframe) {
      // @ts-ignore
      iframe.contentWindow.postMessage(
        {
          type: 'usb-permissions-init',
          extension: browser.runtime.id,
        },
        '*'
      )
    }
  } else if (event.data === 'usb-permissions-close') {
    switchToPopupTab()
  }
})

window.addEventListener('beforeunload', switchToPopupTab)

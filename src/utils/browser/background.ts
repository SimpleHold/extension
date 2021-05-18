import { browser, Tabs } from 'webextension-polyfill-ts'

// Utils
import { IRequest } from '@utils/browser/types'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Config
import { getCurrency } from '@config/currencies'

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    const { screenX, screenY, outerWidth, site, favicon, currency, chain } = request.data

    localStorage.setItem('requesterSite', JSON.stringify({ url: site, favicon }))

    browser.windows.create({
      url: `select-address.html?currency=${currency}&chain=${chain}`,
      type: 'popup',
      width: 375,
      height: 700,
      left: Math.max(screenX + (outerWidth - 375), 0),
      top: screenY,
    })
  }

  if (request.type === 'set_address') {
    const tabs = await browser.tabs.query({ active: true })

    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, request)
    }
  }

  if (request.type === 'request_send_screen') {
    const {
      screenX,
      screenY,
      outerWidth,
      size,
      readOnly,
      currency,
      amount,
      recipientAddress,
    } = request.data

    const tabs = await browser.tabs.query({ active: true })
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    localStorage.setItem('tab', JSON.stringify(currentTab[0]))
    localStorage.setItem(
      'sendPageProps',
      JSON.stringify({ size, readOnly, currency, amount, recipientAddress })
    )

    const checkExist: Tabs.Tab | undefined = tabs.find((tab: Tabs.Tab) => tab.url === 'send.html')

    if (checkExist?.id) {
      const { id } = checkExist

      await browser.tabs.remove(id) // Fix me
    }

    browser.windows.create({
      url: 'send.html',
      type: 'popup',
      width: 375,
      height: 705,
      left: Math.max(screenX + (outerWidth - 375), 0),
      top: screenY,
    })
  }
})

const generateContextMenu = async () => {
  const wallets = getWallets()

  await browser.contextMenus.removeAll()

  if (wallets?.length) {
    const parent = browser.contextMenus.create({
      title: 'SimpleHold',
      id: 'sh-parent',
      contexts: ['editable'],
    })

    const allowedSymbols = ['btc', 'eth', 'ltc', 'bnb', 'dash']

    for (const [index, item] of allowedSymbols.entries()) {
      const getSymbolWallets = wallets.filter(
        (wallet: IWallet) => toLower(wallet.symbol) === toLower(item)
      )

      if (getSymbolWallets.length) {
        const getCurrencyInfo = getCurrency(item)

        if (getCurrencyInfo) {
          const { name } = getCurrencyInfo

          const currencyMenu = browser.contextMenus.create({
            title: name,
            parentId: parent,
            id: item,
            contexts: ['editable'],
          })

          const latestBtcAddresses = getSymbolWallets.slice(-5)

          for (const btcAddress of latestBtcAddresses) {
            const { address } = btcAddress

            browser.contextMenus.create({
              title: address,
              id: address,
              contexts: ['editable'],
              parentId: currencyMenu,
            })
          }
        }
      }

      if (index === allowedSymbols.length - 1) {
        browser.contextMenus.create({
          title: 'More...',
          parentId: parent,
          id: 'sh-other-wallets',
          contexts: ['editable'],
        })
      }
    }
  }
}

browser.runtime.onInstalled.addListener(() => {
  setInterval(() => {
    generateContextMenu()
  }, 5000)
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const tabs = await browser.tabs.query({ active: true })

  if (tabs[0]?.id) {
    if (info.menuItemId !== 'sh-other-wallets') {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'context-menu-address',
        data: {
          address: info.menuItemId,
        },
      })
    } else {
      localStorage.setItem('tab', JSON.stringify(tab))

      const { screenX, screenY, outerWidth } = window

      browser.windows.create({
        url: `select-address.html`,
        type: 'popup',
        width: 375,
        height: 700,
        left: Math.max(screenX + (outerWidth - 375), 0),
        top: screenY,
      })
    }
  }
})

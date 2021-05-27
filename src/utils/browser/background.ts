import { browser, Tabs } from 'webextension-polyfill-ts'

// Utils
import { IRequest } from '@utils/browser/types'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { getUrl } from '@utils/extension'

// Config
import { getCurrency } from '@config/currencies'

let activeRequest: string | null

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    if (activeRequest === request.type) {
      return
    }
    activeRequest = request.type

    const { screenX, screenY, outerWidth, currency, chain } = request.data

    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    localStorage.setItem('tab', JSON.stringify(currentTab[0]))

    const tabs = await browser.tabs.query({ active: true })

    const checkExist: Tabs.Tab | undefined = tabs.find(
      (tab: Tabs.Tab) => tab.title === 'SimpleHold Wallet | Select address'
    )

    if (checkExist?.id) {
      await browser.tabs.remove(checkExist.id)
    }

    await browser.windows.create({
      url: `select-address.html?currency=${currency}&chain=${chain}`,
      type: 'popup',
      width: 375,
      height: 728,
      left: Math.max(screenX + (outerWidth - 375), 0),
      top: screenY,
    })
    activeRequest = null
  }

  if (request.type === 'set_address') {
    const tabs = await browser.tabs.query({ active: true })

    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, request)
    }
  }

  if (request.type === 'request_send') {
    if (activeRequest === request.type) {
      return
    }
    activeRequest = request.type

    const {
      screenX,
      screenY,
      outerWidth,
      readOnly,
      currency,
      amount,
      recipientAddress,
      chain,
    } = request.data

    const tabs = await browser.tabs.query({ active: true })
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    localStorage.setItem('tab', JSON.stringify(currentTab[0]))
    localStorage.setItem(
      'sendPageProps',
      JSON.stringify({ readOnly, currency, amount, recipientAddress, chain })
    )

    const checkExist: Tabs.Tab | undefined = tabs.find(
      (tab: Tabs.Tab) => tab.url === getUrl('send.html')
    )

    if (checkExist?.id) {
      await browser.tabs.remove(checkExist.id)
    }

    await browser.windows.create({
      url: 'send.html',
      type: 'popup',
      width: 375,
      height: 728,
      left: Math.max(screenX + (outerWidth - 375), 0),
      top: screenY,
    })
    activeRequest = null
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
          const currencyMenu = browser.contextMenus.create({
            title: getCurrencyInfo.name,
            parentId: parent,
            id: item,
            contexts: ['editable'],
          })

          const latestWallets = getSymbolWallets.slice(-5)

          for (const latestWallet of latestWallets) {
            const { address } = latestWallet

            browser.contextMenus.create({
              title: address,
              id: `${toLower(item)}_${address}`,
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
      const [, address] = `${info.menuItemId}`.split('_')

      await browser.tabs.sendMessage(tabs[0].id, {
        type: 'context-menu-address',
        data: {
          address,
        },
      })
    } else {
      localStorage.setItem('tab', JSON.stringify(tab))

      const { screenX, screenY, outerWidth } = window

      const tabs = await browser.tabs.query({ active: true })

      const checkExist: Tabs.Tab | undefined = tabs.find(
        (tab: Tabs.Tab) => tab.title === 'SimpleHold Wallet | Select address'
      )

      if (checkExist?.id) {
        await browser.tabs.remove(checkExist.id)
      }

      await browser.windows.create({
        url: `select-address.html`,
        type: 'popup',
        width: 375,
        height: 728,
        left: Math.max(screenX + (outerWidth - 375), 0),
        top: screenY,
      })
    }
  }
})

import { browser, Tabs } from 'webextension-polyfill-ts'

// Utils
import { IRequest } from '@utils/browser/types'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { getUrl, openWebPage } from '@utils/extension'
import { setItem, getItem } from '@utils/storage'
import { generateTag } from '@utils/currencies/ripple'
import { validateUrl } from '@utils/validate'

// Config
import { getCurrency } from '@config/currencies'
import { getPhishingUrls } from 'utils/api'

let activeRequest: string | undefined
let currentWindowId: number
let activeTabUrl: string | undefined

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  alert(tab.url)
  if (tab?.url) {
    const { url } = tab

    if (validateUrl(url) && activeTabUrl !== url) {
      activeTabUrl = url

      checkPhishing(tab)
    }
  }
})

const checkPhishing = async (tab: Tabs.Tab): Promise<void> => {
  const getPhishingUrls = getItem('phishingUrls')

  if (tab?.url && getPhishingUrls) {
    const { url } = tab
    const parsetPhishingUrls = JSON.parse(getPhishingUrls)

    if (parsetPhishingUrls.indexOf(url) !== -1) {
      await openWebPage(getUrl('phishing.html'))
    }
  }
}

browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId !== -1) {
    const getAllWindows = await browser.windows.getAll()

    const checkIsNonPopup = getAllWindows.find((window) => window.id === windowId)

    if (checkIsNonPopup?.type !== 'popup') {
      currentWindowId = windowId
    }
  }
})

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  if (request.type === 'request_addresses') {
    if (activeRequest === request.type) {
      return
    }
    activeRequest = request.type

    const { screenX, screenY, outerWidth, currency, chain } = request.data

    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    setItem('tab', JSON.stringify(currentTab[0]))

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
    activeRequest = undefined
  }

  if (request.type === 'set_address') {
    const tabs = await browser.tabs.query({
      active: true,
      windowId: currentWindowId,
    })

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
      extraId,
    } = request.data

    const tabs = await browser.tabs.query({ active: true })
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    setItem('tab', JSON.stringify(currentTab[0]))
    setItem(
      'sendPageProps',
      JSON.stringify({ readOnly, currency, amount, recipientAddress, chain, extraId })
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
    activeRequest = undefined
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
      documentUrlPatterns: [
        'https://simpleswap.io/*',
        'https://simplehold.io/*',
        'http://localhost/*',
      ],
    })

    const allowedSymbols = ['btc', 'eth', 'ltc', 'bnb', 'dash', 'xrp']

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

          for (const [indexWallet, latestWallet] of latestWallets.entries()) {
            const { address } = latestWallet

            browser.contextMenus.create({
              title: address,
              id: `${toLower(item)}_${address}`,
              contexts: ['editable'],
              parentId: currencyMenu,
            })

            if (indexWallet === latestWallets.length - 1 && item === 'xrp') {
              browser.contextMenus.create({
                title: 'Generate Destination tag…',
                id: `${toLower(item)}_extraId`,
                contexts: ['editable'],
                parentId: currencyMenu,
              })
            }
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

const onGetPhishingUrls = async () => {
  const data = await getPhishingUrls()

  if (data?.length) {
    setItem('phishingUrls', JSON.stringify(data))
  }

  setTimeout(() => {
    onGetPhishingUrls()
  }, 900000)
}

browser.runtime.onInstalled.addListener(() => {
  setInterval(() => {
    generateContextMenu()
  }, 5000)

  onGetPhishingUrls()
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const tabs = await browser.tabs.query({
    active: true,
    windowId: currentWindowId,
  })

  if (tabs[0]?.id) {
    if (info.menuItemId !== 'sh-other-wallets') {
      const menuItemId = `${info.menuItemId}`.split('_')[1]

      const data = menuItemId === 'extraId' ? generateTag() : menuItemId

      await browser.tabs.sendMessage(tabs[0].id, {
        type: 'context-menu-address',
        data: {
          address: data,
        },
      })
    } else {
      setItem('tab', JSON.stringify(tab))

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

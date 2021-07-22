import { browser, Tabs } from 'webextension-polyfill-ts'

// Utils
import { IRequest } from '@utils/browser/types'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { getManifest, getUrl, openWebPage } from '@utils/extension'
import { setItem, getJSON } from '@utils/storage'
import { generateTag } from '@utils/currencies/ripple'
import { getPhishingSites } from '@utils/api'
import { TPhishingSite } from '@utils/api/types'
import { msToMin } from '@utils/dates'
import { validateUrl } from '@utils/validate'

// Types
import { TPopupPosition } from './types'

// Config
import { getCurrency } from '@config/currencies'

let activeRequest: string | undefined
let currentWindowId: number
let currentPhishingSite: string | undefined
let currentPopupWindow: number

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  checkPhishing(tab)
})

const checkPhishing = async (tab: Tabs.Tab): Promise<void> => {
  const sites = getJSON('phishingSites')

  if (tab.url && sites?.length && validateUrl(tab.url) && currentPhishingSite !== tab.url) {
    const { origin } = new URL(tab.url)

    currentPhishingSite = tab.url

    const findPhishingSite = sites.find(
      (site: TPhishingSite) => new URL(site.url).origin === origin
    )

    if (findPhishingSite) {
      if (
        findPhishingSite?.latestVisit &&
        msToMin(new Date().getTime() - findPhishingSite.latestVisit) < 15
      ) {
        return
      }

      setItem('phishingSite', JSON.stringify(findPhishingSite))
      setItem('phishingSiteUrl', tab.url)
      await openWebPage(getUrl('phishing.html'))
    } else {
      currentPhishingSite = undefined
    }
  }
}

browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId !== -1) {
    const getAllWindows = await browser.windows.getAll()

    const checkIsNonPopup = getAllWindows.find((window) => window.id === windowId)

    if (checkIsNonPopup?.type !== 'popup') {
      currentWindowId = windowId
    } else {
      currentPopupWindow = windowId
    }
  }
})

const getPopupPosition = async (
  screenX: number,
  screenY: number,
  outerWidth: number
): Promise<TPopupPosition> => {
  let left = 0
  let top = 0

  const lastFocused = await browser.windows.getLastFocused()

  if (lastFocused?.top && lastFocused?.left && lastFocused.width) {
    top = lastFocused.top
    left = lastFocused.left + (lastFocused.width - 375)
  } else {
    top = Math.max(screenY, 0)
    left = Math.max(screenX + (outerWidth - 375), 0)
  }

  return {
    top,
    left,
  }
}

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

    const { top, left } = await getPopupPosition(screenX, screenY, outerWidth)

    await browser.windows.create({
      url: `select-address.html?currency=${currency}&chain=${chain}`,
      type: 'popup',
      width: 375,
      height: 728,
      top,
      left,
    })
    activeRequest = undefined
  } else if (request.type === 'request_send') {
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

    const { top, left } = await getPopupPosition(screenX, screenY, outerWidth)

    await browser.windows.create({
      url: 'send.html',
      type: 'popup',
      width: 375,
      height: 728,
      top,
      left,
    })
    activeRequest = undefined
  } else if (request.type === 'save_tab_info') {
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })
    setItem('tab', JSON.stringify(currentTab[0]))
  } else if (request.type === 'remove_window') {
    try {
      await browser.windows.remove(currentPopupWindow)
    } catch {}
  } else if (request.type === 'save_send_params') {
    const { readOnly, currency, amount, recipientAddress, chain, extraId } = request.data

    setItem(
      'sendPageProps',
      JSON.stringify({ readOnly, currency, amount, recipientAddress, extraId })
    )
  } else {
    const tabs = await browser.tabs.query({
      active: true,
      windowId: currentWindowId,
    })

    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, request)
    }
  }
})

const generateContextMenu = async () => {
  const wallets = getWallets()

  await browser.contextMenus.removeAll()
  const manifest = getManifest()

  setTimeout(() => {
    generateContextMenu()
  }, 5000)

  if (wallets?.length && manifest) {
    const parent = browser.contextMenus.create({
      title: 'SimpleHold',
      id: 'sh-parent',
      contexts: ['editable'],
      // @ts-ignore
      documentUrlPatterns: manifest.content_scripts[0].matches,
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

const onGetPhishingSites = async () => {
  const data = await getPhishingSites()

  setTimeout(() => {
    onGetPhishingSites()
  }, 900000)

  if (data?.length) {
    setItem('phishingSites', JSON.stringify(data))
  }
}

browser.runtime.onInstalled.addListener(() => {
  setTimeout(() => {
    generateContextMenu()
  }, 5000)

  setTimeout(() => {
    onGetPhishingSites()
  }, 900000)
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

      const { top, left } = await getPopupPosition(screenX, screenY, outerWidth)

      await browser.windows.create({
        url: `select-address.html`,
        type: 'popup',
        width: 375,
        height: 728,
        top,
        left,
      })
    }
  }
})

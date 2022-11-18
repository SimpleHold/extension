import browser, { Tabs } from 'webextension-polyfill'

// Utils
import { getManifest, getUrl, openWebPage } from '@utils/extension'
import { toLower } from '@utils/format'
import { TPhishingSite } from '@utils/api/types'
import { msToMin } from '@utils/dates'
import { validateUrl } from '@utils/validate'

// Coins
import { generateExtraId } from '@coins/xrp'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'
import config from '@config/index'

// Types
import { IRequest } from '@utils/browser/types'
import { IWallet } from '@utils/wallet'
import { TPopupPosition, TResponse } from './types'
import { TToken } from '@tokens/types'

let activeRequest: string | undefined
let currentWindowId: number
let currentPhishingSite: string | undefined
let currentPopupWindow: number

const sendRequest = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url)

    return response.json()
  } catch {
    return null
  }
}

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

const LS = {
  getAllItems: () => browser.storage.local.get(),
  getItem: async (key: string) => (await browser.storage.local.get(key))[key],
  setItem: (key: string, val: any) => browser.storage.local.set({ [key]: val }),
  removeItems: (keys: string[]) => browser.storage.local.remove(keys),
}

browser.runtime.onMessage.addListener(async (request: IRequest) => {
  const { type, data } = request

  if (type === 'close_select_address_window') {
    const [{ id: tabId }] = await browser.tabs.query({ active: true, currentWindow: true })

    if (tabId) {
      await browser.tabs.remove(tabId)
    }

    return
  }

  if (type === 'wallets') {
    await LS.setItem('wallets', data)
    return
  }

  if (type === 'request_addresses') {
    if (activeRequest === type) {
      return
    }
    activeRequest = type

    const { screenX, screenY, outerWidth, currency, chain } = data

    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    await LS.setItem('tab', JSON.stringify(currentTab[0]))

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
  } else if (type === 'request_send') {
    if (activeRequest === type) {
      return
    }
    activeRequest = type

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
    } = data

    const tabs = await browser.tabs.query({ active: true })
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })

    await LS.setItem('tab', JSON.stringify(currentTab[0]))
    await LS.setItem(
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
  } else if (type === 'save_tab_info') {
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true })
    await LS.setItem('tab', JSON.stringify(currentTab[0]))
  } else if (type === 'remove_window') {
    try {
      await browser.windows.remove(currentPopupWindow)
    } catch {}
  } else if (type === 'save_send_params') {
    const { readOnly, currency, amount, recipientAddress, chain, extraId } = data

    await LS.setItem(
      'sendPageProps',
      JSON.stringify({ readOnly, currency, amount, recipientAddress, extraId, chain })
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

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  checkPhishing(tab)
})

browser.alarms.onAlarm.addListener(({ name }) => {
  if (name === 'generateContextMenu') {
    generateContextMenu()
  }

  if (name === 'getPhishingSites') {
    getPhishingSites()
  }

  if (name === 'getTokens') {
    getTokens()
  }
})

browser.runtime.onInstalled.addListener(async () => {
  await browser.alarms.clearAll()

  getTokens()
  getPhishingSites()

  browser.alarms.create('generateContextMenu', { periodInMinutes: 0.2 })
  browser.alarms.create('getPhishingSites', { periodInMinutes: 15 })
  browser.alarms.create('getTokens', { periodInMinutes: 10 })
})

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

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const tabs = await browser.tabs.query({
    active: true,
    windowId: currentWindowId,
  })

  if (tabs[0]?.id) {
    if (info.menuItemId !== 'sh-other-wallets') {
      const menuItemId = `${info.menuItemId}`.split('_')[1]

      const address = menuItemId === 'extraId' ? generateExtraId() : menuItemId

      await browser.tabs.sendMessage(tabs[0].id, {
        type: 'context-menu-address',
        data: {
          address,
        },
      })
    } else {
      LS.setItem('tab', JSON.stringify(tab))

      const getCurrentWindow = await browser.windows.getCurrent()

      if (getCurrentWindow.top && getCurrentWindow.left && getCurrentWindow.width) {
        const tabs = await browser.tabs.query({ active: true })
        const checkExist: Tabs.Tab | undefined = tabs.find(
          (tab: Tabs.Tab) => tab.title === 'SimpleHold Wallet | Select address'
        )

        if (checkExist?.id) {
          await browser.tabs.remove(checkExist.id)
        }

        const { top, left } = await getPopupPosition(
          getCurrentWindow.top,
          getCurrentWindow.left,
          getCurrentWindow.width
        )

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
  }
})

const getPhishingSites = async () => {
  const request = await sendRequest<TResponse<TPhishingSite[]>>(
    `${config.serverUrl}/phishing-sites`
  )

  if (request) {
    const { data } = request

    if (data?.length) {
      await LS.setItem('phishingSites', JSON.stringify(data))
    }
  }
}

const generateContextMenu = async (): Promise<void> => {
  await browser.contextMenus.removeAll()

  const manifest = getManifest()
  const wallets = await LS.getItem('wallets')

  const documentUrlPatterns = manifest.content_scripts?.[0]?.matches

  if (wallets?.length && documentUrlPatterns) {
    const parent = browser.contextMenus.create({
      title: 'SimpleHold',
      id: 'sh-parent',
      contexts: ['editable'],
      documentUrlPatterns,
    })

    const allowedSymbols = ['btc', 'eth', 'ltc', 'bnb', 'dash', 'xrp']

    for (const [index, item] of allowedSymbols.entries()) {
      const getSymbolWallets = wallets.filter(
        (wallet: IWallet) => toLower(wallet.symbol) === toLower(item)
      )

      if (getSymbolWallets.length) {
        const currencyInfo = getCurrencyInfo(item)

        if (currencyInfo) {
          const currencyMenu = browser.contextMenus.create({
            title: currencyInfo.name,
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

const checkPhishing = async (tab: Tabs.Tab): Promise<void> => {
  const getItem = await LS.getItem('phishingSites')

  if (getItem) {
    const sites = JSON.parse(getItem)

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

        await LS.setItem('phishingSite', JSON.stringify(findPhishingSite))
        await LS.setItem('phishingSiteUrl', tab.url)
        await openWebPage(getUrl('phishing.html'))
      } else {
        currentPhishingSite = undefined
      }
    }
  }
}

const getTokens = async (): Promise<void> => {
  const list: TToken[] = []

  const types = ['tokens', 'tokens/tron', 'tokens/avax', 'tokens/solana', 'tokens/terra-classic']

  for (const type of types) {
    const request = await sendRequest<TResponse<TToken[]>>(`${config.serverUrl}/${type}`)

    if (request?.data?.length) {
      list.push(...request.data)
    }
  }

  await LS.setItem('tokens', list)
}

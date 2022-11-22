import browser, { Tabs, Cookies } from 'webextension-polyfill'

export type Cookie = Cookies.Cookie

export const getId = (): string => {
  return browser.runtime.id
}

export const getUrl = (path: string): string => {
  return browser.runtime.getURL(path)
}

export const openWebPage = async (url: string): Promise<void> => {
  await browser.tabs.create({ url })
}

export const openAppInNewWindow = (): void => {
  window.open(
    getUrl('popup.html'),
    'SimpleHold Wallet',
    'popup=yes,left=500,top=0,width=375,height=630,resizable=no,location=no,status=no,scrollbars=no'
  )
  window.close()
}

export const setBadgeBackgroundColor = (color: string) => {
  browser.action.setBadgeBackgroundColor({ color })
}

export const setBadgeText = async (text: string): Promise<void> => {
  browser.action.setBadgeText({ text })
}

export const getBadgeText = async (): Promise<string> => {
  return await browser.action.getBadgeText({})
}

export const getManifest = () => {
  return browser.runtime.getManifest()
}

export const getCurrentTab = async (): Promise<Tabs.Tab> => {
  return await browser.tabs.getCurrent()
}

export const updateTab = async (
  tabId: number,
  props: Tabs.UpdateUpdatePropertiesType
): Promise<Tabs.Tab> => {
  return await browser.tabs.update(tabId, props)
}

export const getAllCookies = async (url: string): Promise<Cookie[]> => {
  return browser.cookies.getAll({ url })
}

export const getTabs = async (query: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]> => {
  return await browser.tabs.query(query)
}

export const removeTabs = async (tabIds: number | number[]): Promise<void> => {
  return await browser.tabs.remove(tabIds)
}

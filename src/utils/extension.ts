import { browser, Tabs } from 'webextension-polyfill-ts'

export const getId = (): string => {
  return browser.runtime.id
}

export const getUrl = (path: string): string => {
  return browser.extension.getURL(path)
}

export const openWebPage = async (url: string): Promise<void> => {
  await browser.tabs.create({ url })
}

export const setBadgeBackgroundColor = (color: string) => {
  browser.browserAction.setBadgeBackgroundColor({ color })
}

export const setBadgeText = (text: string) => {
  browser.browserAction.setBadgeText({ text })
}

export const getBadgeText = async (): Promise<string> => {
  return await browser.browserAction.getBadgeText({})
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

export const getTabs = async (query: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]> => {
  return await browser.tabs.query(query)
}

export const removeTabs = async (tabIds: number | number[]): Promise<void> => {
  return await browser.tabs.remove(tabIds)
}

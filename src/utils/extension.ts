import { browser, Tabs } from 'webextension-polyfill-ts'

interface IOpenPageOptions {
  removeCurrent?: boolean
}

export const getId = (): string => {
  return browser.runtime.id
}

export const getUrl = (path: string): string => {
  return browser.extension.getURL(path)
}

export const openWebPage = async (url: string, options: IOpenPageOptions = {}): Promise<void> => {
  const { removeCurrent = false } = options

  if (removeCurrent) {
    await removeExistTab(url)
  }

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

export const removeExistTab = async (url: string): Promise<void> => {
  const tabs = await browser.tabs.query({})

  const checkExist: Tabs.Tab | undefined = tabs.find((tab: Tabs.Tab) => tab.url === url)

  if (checkExist?.id) {
    await browser.tabs.remove(checkExist.id)
  }
}

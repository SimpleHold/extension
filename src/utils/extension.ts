import { browser, Tabs } from 'webextension-polyfill-ts'

export const getId = (): string => {
  return browser.runtime.id
}

export const getUrl = (path: string): string => {
  return browser.extension.getURL(path)
}

export const openWebPage = (url: string): Promise<Tabs.Tab> => {
  return browser.tabs.create({ url })
}

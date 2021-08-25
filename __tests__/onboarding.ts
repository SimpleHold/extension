import puppeteer from 'puppeteer'

let browser: puppeteer.Browser
let page: puppeteer.Page

beforeAll(async () => {
  const pathToExtension = require('path').join(__dirname, '../extension/chrome/manifest.json')

  browser = await puppeteer.launch({
    headless: false,
    args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
  })
})

test('renders learn react link', async () => {
  await page.waitForSelector('.App')
  const header = await page.$eval('.App-header>p', (e: any) => e.innerHTML)
  expect(header).toBe(`Edit <code>src/App.js</code> and save to reload.`)
  const link = await page.$eval('.App-header>a', (e: any) => {
    return {
      innerHTML: e.innerHTML,
      href: e.href,
    }
  })
  expect(link.innerHTML).toBe(`Learn React`)
  expect(link.href).toBe('https://reactjs.org/')
})

// 4
afterAll(() => {
  browser.close()
})

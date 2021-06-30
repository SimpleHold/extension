import puppeteer from 'puppeteer'
import path from 'path'

test('Start onboarding', async () => {
  const getExtension = path.join(__dirname, '../../extension/chrome/')

  await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${getExtension}`,
      `--load-extension=${getExtension}`,
      `--window-size=375,600`,
    ],
  })
})

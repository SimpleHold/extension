const { writeFile } = require('fs').promises
const os = require('os')
const path = require('path')
const mkdirp = require('mkdirp')
const puppeteer = require('puppeteer')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
  const browser = await puppeteer.launch()
  global.__BROWSER_GLOBAL__ = browser

  mkdirp.sync(DIR)
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

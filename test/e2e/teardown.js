const os = require('os')
const path = require('path')
const rimraf = require('rimraf')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
module.exports = async function () {
  await global.__BROWSER_GLOBAL__.close()

  rimraf.sync(DIR)
}

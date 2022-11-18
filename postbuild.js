const fsExtra = require('fs-extra')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, 'dist', 'js')
const dest = path.join(__dirname, 'dist')

const files = [
  'connect-ledger.html',
  'connect-trezor.html',
  'download-backup.html',
  'phishing.html',
  'popup.html',
  'restore-backup.html',
  'select-address.html',
  'send-confirm.html',
  'send.html',
  'trezor-usb-permissions.html',
]

const moveHTMLFiles = () => {
  for (const file of files) {
    const joinSrc = path.join(src, file)
    const joinDest = path.join(dest, file)

    if (!fs.existsSync(joinSrc)) {
      fsExtra.move(joinSrc, joinDest)
    }
  }
}

moveHTMLFiles()

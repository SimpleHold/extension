const { PrivateKey } = require('litecore-lib')

function generateWallet() {
  const privateKey = new PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export default {
  generateWallet,
}

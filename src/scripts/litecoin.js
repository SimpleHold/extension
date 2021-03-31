/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const litecore = require('bitcore-lib-ltc')

const litecoin = (function () {
  const generateWallet = () => {
    const privateKey = new litecore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new litecore.PrivateKey(privateKey).toAddress().toString()
  }

  return {
    generateWallet,
    importPrivateKey,
  }
})()

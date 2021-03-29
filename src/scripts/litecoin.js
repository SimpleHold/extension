/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const litecore = require('litecore-lib')

const litecoin = (function () {
  const generateWallet = () => {
    const privateKey = new litecore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  return {
    generateWallet,
  }
})()

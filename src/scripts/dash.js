/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const dash = (function () {
  const generateWallet = () => {
    const privateKey = new window.dashcore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new window.dashcore.PrivateKey(privateKey).toAddress().toString()
  }

  return {
    generateWallet,
    importPrivateKey,
  }
})()

/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
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

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new litecore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return {
      raw: transaction.toString(),
      hash: transaction.toObject().hash,
    }
  }

  const getFee = (outputs, to, amount, changeAddress) => {
    try {
      return new litecore.Transaction().from(outputs).to(to, amount).change(changeAddress).getFee()
    } catch (err) {
      return 10000
    }
  }

  const isAddressValid = (address) => {
    try {
      const getAddress = new litecore.Address.fromString(address)
      return getAddress.toString().toLowerCase() === address.toLowerCase()
    } catch (err) {
      return false
    }
  }

  return {
    generateWallet,
    importPrivateKey,
    createTransaction,
    getFee,
    isAddressValid,
  }
})()

/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const dogecore = require('bitcore-lib-doge')

const dogecoin = (function () {
  const generateWallet = () => {
    const privateKey = new dogecore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new dogecore.PrivateKey(privateKey).toAddress().toString()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new dogecore.Transaction()
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
    return new dogecore.Transaction().from(outputs).to(to, amount).change(changeAddress).getFee()
  }

  const isAddressValid = (address) => {
    try {
      const getAddress = new dogecore.Address.fromString(address)
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

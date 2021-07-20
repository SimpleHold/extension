/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const bitcore = require('bitcore-lib')

const bitcoin = (function () {
  const generateWallet = () => {
    const privateKey = new bitcore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new bitcore.PrivateKey(privateKey).toAddress().toString()
  }

  const toSat = (value) => {
    return bitcore.Unit.fromBTC(value).toSatoshis()
  }

  const fromSat = (value) => {
    return bitcore.Unit.fromSatoshis(value).toBTC()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new bitcore.Transaction()
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

  const createUnsignedTx = (outputs, to, amount, fee, changeAddress) => {
    const transaction = new bitcore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)

    return transaction.toString()
  }

  const getFee = (outputs, to, amount, changeAddress) => {
    return new bitcore.Transaction().from(outputs).to(to, amount).change(changeAddress).getFee()
  }

  const isAddressValid = (address) => {
    try {
      const getAddress = new bitcore.Address.fromString(address)
      return getAddress.toString().toLowerCase() === address.toLowerCase()
    } catch (err) {
      return false
    }
  }

  return {
    generateWallet,
    importPrivateKey,
    toSat,
    fromSat,
    createTransaction,
    getFee,
    isAddressValid,
    createUnsignedTx,
  }
})()

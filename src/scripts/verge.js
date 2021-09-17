/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const vergecore = require('verge-lib')

const verge = (function () {
  const generateWallet = () => {
    const privateKey = new vergecore.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new vergecore.PrivateKey(privateKey).toAddress().toString()
  }

  const toSat = (value) => {
    return vergecore.Unit.fromBTC(value).toSatoshis()
  }

  const fromSat = (value) => {
    return vergecore.Unit.fromSatoshis(value).toBTC()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new vergecore.Transaction()
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
    const transaction = new vergecore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)

    return transaction.toString()
  }

  const getFee = (outputs, to, amount, changeAddress, feePerByte) => {
    const txSize = new vergecore.Transaction()
      .from(outputs)
      .to(to, amount)
      .change(changeAddress)
      .toString().length

    return txSize * 2 * feePerByte
  }

  const isAddressValid = (address) => {
    try {
      const getAddress = new vergecore.Address.fromString(address)
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

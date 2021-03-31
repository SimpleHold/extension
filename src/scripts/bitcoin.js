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

  const getTransactionSize = (outputs) => {
    return new bitcore.Transaction().from(outputs).toString().length
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

  return {
    generateWallet,
    importPrivateKey,
    getTransactionSize,
    toSat,
    fromSat,
    createTransaction,
  }
})()

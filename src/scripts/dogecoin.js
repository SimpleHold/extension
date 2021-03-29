/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const dogecore = require('dogecore-lib')

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

  const getTransactionSize = (outputs) => {
    return new dogecore.Transaction().from(outputs).toString().length
  }

  const toSat = (value) => {
    return dogecore.Unit.fromBTC(value).toSatoshis()
  }

  const fromSat = (value) => {
    return dogecore.Unit.fromSatoshis(value).toBTC()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new dogecore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return {
      raw: transaction.serialize(),
      hash: transaction.hash,
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

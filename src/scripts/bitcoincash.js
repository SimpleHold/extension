/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const bitcorecash = require('bitcore-lib-cash')

const bitcoincash = (function () {
  const generateWallet = () => {
    const privateKey = new bitcorecash.PrivateKey()

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new bitcorecash.PrivateKey(privateKey).toAddress().toString()
  }

  const getTransactionSize = (outputs) => {
    return new bitcorecash.Transaction().from(outputs)._estimateFee()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new bitcorecash.Transaction()
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
    createTransaction,
  }
})()

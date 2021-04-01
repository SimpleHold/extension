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

  const getTransactionSize = (outputs) => {
    return new dogecore.Transaction().from(outputs)._estimateFee()
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

  return {
    generateWallet,
    importPrivateKey,
    getTransactionSize,
    createTransaction,
  }
})()

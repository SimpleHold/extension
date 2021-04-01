/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
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

  const getTransactionSize = (outputs) => {
    return new window.dashcore.Transaction().from(outputs)._estimateFee()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    const transaction = new window.dashcore.Transaction()
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

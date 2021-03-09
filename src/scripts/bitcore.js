/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const { Transaction, Unit, PrivateKey } = require('bitcore-lib')

function createTransaction(outputs, to, amount, fee, changeAddress, privateKey) {
  try {
    const transaction = new Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)
      .sign(privateKey)

    return {
      raw: transaction.serialize(),
      hash: transaction.hash,
    }
  } catch (err) {
    return null
  }
}

function generateWallet() {
  const privateKey = new PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

function importAddress(privateKey) {
  try {
    return new PrivateKey(privateKey).toAddress().toString()
  } catch (err) {
    return null
  }
}

function getTransactionSize(outputs) {
  try {
    return new Transaction().from(outputs).toString().length
  } catch (err) {
    return 0
  }
}

function btcToSat(value) {
  return Unit.fromBTC(value).toSatoshis()
}

function satToBtc(value) {
  return Unit.fromSatoshis(value).toBTC()
}

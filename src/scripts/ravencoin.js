/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */

const ravencoinX = (function () {
  const generateWallet = () => {
    const privateKey = new ravencore.PrivateKey()
console.log('@@@@ in generate rvn wallet @@@')
    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  const importPrivateKey = (privateKey) => {
    return new ravencore.PrivateKey(privateKey).toAddress().toString()
  }

  const toSat = (value) => {
    return ravencore.Unit.fromBTC(value).toSatoshis()
  }

  const fromSat = (value) => {
    return ravencore.Unit.fromSatoshis(value).toBTC()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    console.log('in rvn createTransaction')
    try {
      const transaction = new ravencore.Transaction()
        .from(outputs)
        .to(to, amount)
        .fee(fee)
        .change(changeAddress)
        .sign(privateKey)

      console.log('raw')
      const txToStr = transaction.toString()
      console.log(txToStr)
      console.log('length')
      console.log(txToStr.length)

      const res = {
        raw: transaction.toString(),
        hash: transaction.toObject().hash,
      }
      console.log(res)
      return res
    } catch (err) {
      console.log('in rvn createTransaction catch')
      console.log(err)
    }
  }

  const createUnsignedTx = (outputs, to, amount, fee, changeAddress) => {
    const transaction = new ravencore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)

    return transaction.toString()
  }

  const getFee = (outputs, to, amount, changeAddress, feePerByte) => {
    console.log('in rvn getFee')

    console.log({outputs, to, amount, changeAddress, feePerByte})
    try {
      const tx = new ravencore.Transaction()
        .from(outputs)
        .to(to, amount)
        .change(changeAddress)


      const transaction = tx.toString().length


      console.log('transaction', transaction)
      const estFee = transaction * 0.00001
      console.log('estFee', estFee)

      return toSat(estFee)

    } catch (err) {
      console.log('in rvn getFee catch')
      console.log(err)
      return 1337331 // todo
    }
  }

  const isAddressValid = (address) => {
    try {
      const getAddress = new ravencore.Address.fromString(address)
      return getAddress.toString().toLowerCase() === address.toLowerCase()
    } catch (err) {
      return false
    }
  }

  const getExplorerLink = (address) => {
    return `https://rvnblockexplorer.com/api/address/${address}`
  }

  const getTransactionLink = (hash) => {
    return `https://rvnblockexplorer.com/api/tx/${hash}`
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
    getExplorerLink,
    getTransactionLink
  }
})()

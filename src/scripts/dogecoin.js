/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */

bitcore.Networks.add({
  name: 'dogecoin',
  alias: 'doge',
  pubkeyhash: 0x1e,
  privatekey: 0x9e,
  scripthash: 0x16,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  dnsSeeds: [
    'seed.multidoge.org',
    'seed2.multidoge.org',
    'veryseed.denarius.pro',
    'muchseed.denarius.pro',
    'suchseed.denarius.pro',
    'seed.dogecoin.com',
    'seed.dogechain.info',
    'seed.mophides.com',
    'seed.dglibrary.org',
  ],
})

const dogecoin = (function () {
  const network = bitcore.Networks.get('dogecoin')

  const generateWallet = () => {
    try {
      const privateKey = new bitcore.PrivateKey(network)

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    } catch (err) {
      return null
    }
  }

  const importPrivateKey = (privateKey) => {
    try {
      return new bitcore.PrivateKey(privateKey, network).toAddress().toString()
    } catch {
      return null
    }
  }

  const getTransactionSize = (outputs) => {
    try {
      return new bitcore.Transaction().from(outputs).toString().length
    } catch {
      return 0
    }
  }

  const toSat = (value) => {
    return bitcore.Unit.fromBTC(value).toSatoshis()
  }

  const fromSat = (value) => {
    return bitcore.Unit.fromSatoshis(value).toBTC()
  }

  const createTransaction = (outputs, to, amount, fee, changeAddress, privateKey) => {
    try {
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
    } catch {
      return null
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

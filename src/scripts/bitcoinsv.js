/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const bitcore = require('bitcore-lib')

bitcore.Networks.add({
  name: 'bitcoinsv',
  alias: 'bsv',
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  dnsSeeds: ['seed.bitcoinsv.io', 'btccash-seeder.bitcoinunlimited.info'],
})

const bitcoinsv = (function () {
  const generateWallet = () => {
    const network = bitcore.Networks.get('bitcoinsv')
    const privateKey = new bitcore.PrivateKey(network)

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  }

  return {
    generateWallet,
  }
})()

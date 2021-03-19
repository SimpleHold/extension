import bitcore from 'bitcore-lib'
import litecore from 'litecore-lib'
import dogecore from 'bitcore-lib-doge'
import bitcoreCash from 'bitcore-lib-cash'
import bitGoUTXO from 'bitgo-utxo-lib'

// Validate address
import addressValidate from '@config/addressValidate'

bitcore.Networks.add({
  name: 'bitcoinsv',
  alias: 'bsv',
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  dnsSeeds: ['seed.bitcoinsv.io', 'btccash-seeder.bitcoinunlimited.info'],
})

const ZEC = {
  messagePrefix: '\x19Zcash Signed Message:\n',
  bech32: 'zec',
  bip32: {
    public: 0x0488b21e,
    private: 0x488ade4,
  },
  pubKeyHash: 0x1cb8,
  scriptHash: 0x1cbd,
  wif: 0x80,
}

const GRS = {
  messagePrefix: '\x1CGroestlCoin Signed Message:\n',
  bech32: 'grs',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x24,
  scriptHash: 0x05,
  wif: 0x80,
}

export interface INewAddress {
  address: string
  privateKey: string
}

export type TSymbols = 'btc' | 'bch' | 'bsv' | 'ltc' | 'doge' | 'dash' | 'zec' | 'grs'

class GenerateAddress {
  symbol: TSymbols

  constructor(symbol: TSymbols) {
    this.symbol = symbol
  }

  generate = (): INewAddress | null => {
    const { symbol } = this

    if (symbol === 'btc') {
      const privateKey = new bitcore.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'bch') {
      const privateKey = new bitcoreCash.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'bsv') {
      const network = bitcore.Networks.get('bitcoinsv', '')
      const privateKey = new bitcore.PrivateKey('', network)

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'dash') {
      const privateKey = new window.dashcore.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'doge') {
      const privateKey = new dogecore.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'grs') {
      const keyPair = bitGoUTXO.ECPair.makeRandom({ network: GRS })

      return {
        address: keyPair.getAddress(),
        privateKey: keyPair.toWIF(),
      }
    }

    if (symbol === 'ltc') {
      const privateKey = new litecore.PrivateKey()

      return {
        address: privateKey.toAddress().toString(),
        privateKey: privateKey.toWIF(),
      }
    }

    if (symbol === 'zec') {
      const keyPair = bitGoUTXO.ECPair.makeRandom({ network: ZEC })

      return {
        address: keyPair.getAddress(),
        privateKey: keyPair.toWIF(),
      }
    }

    return null
  }

  import = (privateKey: string): string | null => {
    const { symbol } = this

    if (symbol === 'btc') {
      return new bitcore.PrivateKey(privateKey).toAddress().toString()
    }

    if (symbol === 'bch') {
      return new bitcoreCash.PrivateKey(privateKey).toAddress().toString()
    }

    if (symbol === 'bsv') {
      const network = bitcore.Networks.get('bitcoinsv', '')
      return new bitcoreCash.PrivateKey(privateKey, network).toAddress().toString()
    }

    if (symbol === 'dash') {
      return new window.dashcore.PrivateKey(privateKey).toAddress().toString()
    }

    if (symbol === 'doge') {
      return new dogecore.PrivateKey(privateKey).toAddress().toString()
    }

    if (symbol === 'grs') {
      return bitGoUTXO.ECPair.fromWIF(privateKey, GRS).getAddress()
    }

    if (symbol === 'ltc') {
      return new litecore.PrivateKey(privateKey).toAddress().toString()
    }

    if (symbol === 'zec') {
      return bitGoUTXO.ECPair.fromWIF(privateKey, ZEC).getAddress()
    }

    return null
  }

  validate = (address: string): boolean => {
    const { symbol } = this

    return new RegExp(addressValidate[symbol]).test(address)
  }
}

export default GenerateAddress

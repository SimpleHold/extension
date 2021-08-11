import { toLower } from '@utils/format'

class GenerateAddress {
  symbol: string

  constructor(symbol: string) {
    this.symbol = symbol
  }

  static coins() {
    return ['bitcoin', 'bitcoin-cash', 'bitcoin-sv', 'litecoin', 'dogecoin', 'dash']
  }

  getProvider = (): BitcoinLikeProvider | null => {
    const { symbol } = this

    if (symbol === 'btc' || symbol === 'bsv') {
      return bitcoin
    }

    if (symbol === 'bch') {
      return bitcoincash
    }

    if (symbol === 'dash') {
      return dash
    }

    if (symbol === 'doge') {
      return dogecoin
    }

    if (symbol === 'ltc') {
      return litecoin
    }

    return null
  }

  generate = (): TGenerateAddress | null => {
    try {
      const provider = this.getProvider()

      if (provider) {
        return provider.generateWallet()
      }

      return null
    } catch {
      return null
    }
  }

  import = (privateKey: string): string | null => {
    try {
      const provider = this.getProvider()

      if (provider) {
        return provider.importPrivateKey(privateKey)
      }

      return null
    } catch {
      return null
    }
  }

  getFee = (
    address: string,
    outputs: UnspentOutput[],
    amount: string,
    feePerByte: number
  ): number => {
    try {
      const provider = this.getProvider()

      if (provider) {
        return provider.getFee(outputs, address, this.toSat(Number(amount)), address, feePerByte)
      }

      return 0
    } catch {
      return 0
    }
  }

  toSat = (value: number): number => {
    try {
      return bitcoin.toSat(value)
    } catch {
      return 0
    }
  }

  fromSat = (value: number): number => {
    try {
      return bitcoin.fromSat(value)
    } catch {
      return 0
    }
  }

  getNetworkFee = (
    address: string,
    unspentOutputs: UnspentOutput[],
    amount: string,
    feePerByte: number
  ) => {
    const { symbol } = this
    const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
    const utxos: UnspentOutput[] = []

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = this.getFee(address, utxos, amount, feePerByte)

      if (getUtxosValue >= this.toSat(Number(amount)) + transactionFeeBytes) {
        break
      }

      utxos.push(output)
    }

    const networkFee = this.fromSat(this.getFee(address, utxos, amount, feePerByte))

    return {
      networkFee: toLower(symbol) === 'doge' && networkFee < 1 ? 1 : networkFee,
      utxos,
    }
  }

  createTransaction = (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ): string | null => {
    try {
      const provider = this.getProvider()

      if (provider) {
        return provider.createTransaction(outputs, to, amount, fee, changeAddress, privateKey).raw
      }

      return null
    } catch {
      return null
    }
  }

  isAddressValid = (address: string): boolean => {
    const provider = this.getProvider()

    if (provider) {
      return provider.isAddressValid(address)
    }
    return false
  }
}

export default GenerateAddress

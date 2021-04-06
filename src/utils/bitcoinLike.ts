// Validate address
import addressValidate from '@config/addressValidate'

class GenerateAddress {
  symbol: TSymbols

  constructor(symbol: TSymbols) {
    this.symbol = symbol
  }

  generate = (): TGenerateAddress | null => {
    try {
      const { symbol } = this

      if (symbol === 'btc' || symbol === 'bsv') {
        return bitcoin.generateWallet()
      }

      if (symbol === 'bch') {
        return bitcoincash.generateWallet()
      }

      if (symbol === 'dash') {
        return dash.generateWallet()
      }

      if (symbol === 'doge') {
        return dogecoin.generateWallet()
      }

      if (symbol === 'ltc') {
        return litecoin.generateWallet()
      }

      return null
    } catch {
      return null
    }
  }

  import = (privateKey: string): string | null => {
    try {
      const { symbol } = this

      if (symbol === 'btc' || symbol === 'bsv') {
        return bitcoin.importPrivateKey(privateKey)
      }

      if (symbol === 'bch') {
        return bitcoincash.importPrivateKey(privateKey)
      }

      if (symbol === 'dash') {
        return dash.importPrivateKey(privateKey)
      }

      if (symbol === 'doge') {
        return dogecoin.importPrivateKey(privateKey)
      }

      if (symbol === 'ltc') {
        return litecoin.importPrivateKey(privateKey)
      }

      return null
    } catch {
      return null
    }
  }

  getTransactionSize = (outputs: UnspentOutput[]): number => {
    const { symbol } = this

    if (symbol === 'btc' || symbol === 'bsv') {
      return bitcoin.getTransactionSize(outputs)
    }

    if (symbol === 'bch') {
      return bitcoincash.getTransactionSize(outputs)
    }

    if (symbol === 'dash') {
      return dash.getTransactionSize(outputs)
    }

    if (symbol === 'doge') {
      return dogecoin.getTransactionSize(outputs)
    }

    if (symbol === 'ltc') {
      return litecoin.getTransactionSize(outputs)
    }

    return 0
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

  getNetworkFee = (unspentOutputs: UnspentOutput[], feePerByteSat: number, amount: string) => {
    const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
    const utxos: UnspentOutput[] = []

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = this.getTransactionSize(utxos) * feePerByteSat

      if (getUtxosValue >= this.toSat(Number(amount)) + transactionFeeBytes) {
        break
      }

      utxos.push(output)
    }

    return {
      networkFee: this.fromSat(this.getTransactionSize(utxos) * feePerByteSat),
      utxos,
    }
  }

  validate = (address: string): boolean => {
    const { symbol } = this

    return new RegExp(addressValidate[symbol])?.test(address)
  }

  createTransaction = (
    outputs: UnspentOutput[],
    to: string,
    amount: number,
    fee: number,
    changeAddress: string,
    privateKey: string
  ): TCreatedTransaction | null => {
    try {
      const { symbol } = this

      if (symbol === 'btc' || symbol === 'bsv') {
        return bitcoin.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
      }

      if (symbol === 'bch') {
        return bitcoincash.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
      }

      if (symbol === 'dash') {
        return dash.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
      }

      if (symbol === 'doge') {
        return dogecoin.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
      }

      if (symbol === 'ltc') {
        return litecoin.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
      }

      return null
    } catch (err) {
      console.log('err', err)
      return null
    }
  }
}

export default GenerateAddress

// Validate address
import addressValidate from '@config/addressValidate'

export type TSymbols = 'btc' | 'bch' | 'bsv' | 'ltc' | 'doge' | 'dash' | 'zec'

class GenerateAddress {
  symbol: TSymbols

  constructor(symbol: TSymbols) {
    this.symbol = symbol
  }

  generate = (): TGenerateAddress | null => {
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.generateWallet()
    }

    if (symbol === 'bch' || symbol === 'bsv') {
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

    if (symbol === 'zec') {
      return bitgo.zcash.generateWallet()
    }

    return null
  }

  import = (privateKey: string): string | null => {
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.importPrivateKey(privateKey)
    }

    if (symbol === 'bch' || symbol === 'bsv') {
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

    if (symbol === 'zec') {
      return bitgo.zcash.importPrivateKey(privateKey)
    }

    return null
  }

  getTransactionSize = (outputs: UnspentOutput[]): number => {
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.getTransactionSize(outputs)
    }

    if (symbol === 'doge') {
      return dogecoin.getTransactionSize(outputs)
    }

    return 0
  }

  toSat = (value: number): number => {
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.toSat(value)
    }

    if (symbol === 'doge') {
      return dogecoin.toSat(value)
    }
    return 0
  }

  fromSat = (value: number): number => {
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.fromSat(value)
    }

    if (symbol === 'doge') {
      return dogecoin.fromSat(value)
    }
    return 0
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
    const { symbol } = this

    if (symbol === 'btc') {
      return bitcoin.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
    }

    if (symbol === 'doge') {
      return dogecoin.createTransaction(outputs, to, amount, fee, changeAddress, privateKey)
    }
    return null
  }
}

export default GenerateAddress

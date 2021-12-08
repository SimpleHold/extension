import { toLower } from 'utils/format'
import { TCustomFee } from 'utils/api/types'
import { TCustomFees } from 'utils/currencies/types'
import { TFeeResponse } from 'utils/currencies/bitcoinLike/types'

export const coins: string[] = ['rvn']
export const isWithOutputs = true

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  const formatValue = Number(value)

  if (type === 'from') {
    return ravencore.Unit.fromSatoshis(formatValue).toBTC()
  }

  return ravencore.Unit.fromBTC(formatValue).toSatoshis()
}

export const generateWallet = () => {
  const privateKey = new ravencore.PrivateKey()
  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const importPrivateKey = (privateKey: string): string => {
  return new ravencore.PrivateKey(privateKey).toAddress().toString()
}

export const getExplorerLink = (address: string): string => {
  return `https://rvnblockexplorer.com/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://rvnblockexplorer.com/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    const getAddress = new ravencore.Address.fromString(address)
    return toLower(getAddress.toString()) === toLower(address)
  } catch {
    return false
  }
}

export const createTransaction = (
  outputs: UnspentOutput[],
  to: string,
  amount: string,
  fee: number,
  changeAddress: string,
  privateKey: string
): string | null => {
  console.log('in rvn createTransaction')
  try {
    const transaction = new ravencore.Transaction()
      .from(outputs)
      .to(to, Number(amount))
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
    return transaction.toString()
  } catch (err) {
    console.log('in rvn createTransaction catch')
    console.log(err)
    return null
  }
}


const getFeeType = (type: string): TFeeTypes => {
  if (type === 'slow') {
    return 'slow'
  }
  if (type === 'average') {
    return 'average'
  }

  return 'fast'
}

export const getFee = (address: string, outputs: UnspentOutput[], amount: string): number | null => {
  console.log('in getFee')
  console.log({address})
  console.log({ outputs })
  try {
    return new ravencore.Transaction()
      .from(outputs)
      .to(address, formatValue(amount, 'to'))
      .change(address)
      .getFee()

  } catch (err) {
    console.log('getFee err')
    console.log(err)
    return null
  }
}

export const getNetworkFee = (address: string, unspentOutputs: UnspentOutput[], amount: string): TFeeResponse | null => {
  console.log('in getNetworkFee')

  const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []
  console.log('sort outputs')
  console.log(sortOutputs)
  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(address, utxos, amount)

    // if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
    //   break
    // }

    utxos.push(output)
  }

  const averageFee = formatValue(getFee(address, utxos, amount) || 0, 'from').toFixed(5)

  const fees: TCustomFees[]  = [
    {type: 'slow', utxos, value: +averageFee * 0.7},
    {type: 'average', utxos, value: +averageFee},
    {type: 'fast', utxos, value: +averageFee * 2}
    ]

  // const networkFee = formatValue(getFee(address, utxos, amount), 'from')
  // console.log('networkFee', networkFee)
  return {
    fees
  }
}




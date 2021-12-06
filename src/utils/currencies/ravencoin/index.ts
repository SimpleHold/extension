import { toLower } from 'utils/format'

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
): string | null | any => { // todo fix any
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

// export const getFee = (
//   outputs: UnspentOutput[],
//   to: string,
//   amount: string,
//   changeAddress: string,
//   feePerByte: number
// ): number => {
//   console.log('in rvn getFee')
//   console.log({outputs, to, amount, changeAddress, feePerByte})
//   try {
//     const tx = new ravencore.Transaction()
//       .from(outputs)
//       .to(to, amount)
//       .change(changeAddress)
//
//     const transaction = tx.toString().length
//
//     console.log('transaction', transaction)
//     const estFee = transaction * 0.00001
//     console.log('estFee', estFee)
//
//     return formatValue(estFee, 'from')
//
//   } catch (err) {
//     console.log('in rvn getFee catch')
//     console.log(err)
//     return 1337331 // todo
//   }
// }

export const getFee = (address: string, outputs: UnspentOutput[], amount: string): number => {
  console.log('in getFee')
  try {
    return new ravencore.Transaction()
      .from(outputs)
      .to(address, formatValue(amount, 'to'))
      .change(address)
      .getFee()
  } catch (err) {
    console.log('getFee err')
    console.log(err)
    return 1337331 // todo
  }
}

export const getNetworkFee = (address: string, unspentOutputs: UnspentOutput[], amount: string) => {
  console.log('in getNetworkFee')

  const sortOutputs = unspentOutputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []
  console.log('sort outputs')
  console.log(sortOutputs)
  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(address, utxos, amount)

    if (getUtxosValue >= formatValue(amount, 'to') + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  const networkFee = formatValue(getFee(address, utxos, amount), 'from')

  return {
    networkFee,
    utxos,
  }
}

// export const getStandingFee = (): number => {
//   return 0.1
// }



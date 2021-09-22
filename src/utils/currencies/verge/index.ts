import BigNumber from 'bignumber.js'

export const coins: string[] = ['xvg']
export const isWithOutputs = true

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    return verge.generateWallet()
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return verge.importPrivateKey(privateKey)
  } catch {
    return null
  }
}

export const toSat = (value: number): number => {
  try {
    return verge.toSat(value)
  } catch {
    return 0
  }
}

export const fromSat = (value: number): number => {
  try {
    return verge.fromSat(value)
  } catch {
    return 0
  }
}

const getTimeStamp = () => {
  return (Date.now() / 1000) | 0
}

export const createTransaction = (
  outputs: UnspentOutput[],
  to: string,
  amount: number,
  fee: number,
  changeAddress: string,
  privateKey: string
): string | null => {
  try {
    const tx = new vergecore.Transaction()
      .from(outputs)
      .to(to, amount)
      .fee(fee)
      .change(changeAddress)

    const txJson = tx.toJSON()

    txJson.timestamp = getTimeStamp()
    delete txJson.hash

    const toJson = new vergecore.Transaction().fromObject(txJson)

    return toJson.sign(new vergecore.PrivateKey.fromWIF(privateKey)).serialize()
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    return verge.isAddressValid(address)
  } catch {
    return false
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://verge-blockchain.info/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://verge-blockchain.info/tx/${hash}`
}

export const getStandingFee = (): number => {
  return 0.1
}

const getFee = (
  address: string,
  outputs: UnspentOutput[],
  amount: string,
  feePerByte: number
): number => {
  try {
    return verge.getFee(outputs, address, toSat(Number(amount)), address, feePerByte)
  } catch {
    return 0
  }
}

export const getUtxos = (
  outputs: UnspentOutput[],
  address: string,
  amount: string
): UnspentOutput[] => {
  const sortOutputs = outputs.sort((a, b) => a.satoshis - b.satoshis)
  const utxos: UnspentOutput[] = []

  for (const output of sortOutputs) {
    const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
    const transactionFeeBytes = getFee(address, utxos, amount, 1)

    if (getUtxosValue >= toSat(Number(amount)) + transactionFeeBytes) {
      break
    }

    utxos.push(output)
  }

  return utxos
}

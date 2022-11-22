import { cryptoUtils, Sotez } from 'sotez'
import BigNumber from 'bignumber.js'

// Types
import { TCurrencyConfig, TGenerateAddress, TInternalTxProps } from '@coins/types'

const derivationPath = "44'/1729'/0'/0'"
const fee = 1420

export const config: TCurrencyConfig = {
  coins: ['xtz'],
  isWithPhrase: true,
  wordsSize: [12, 24],
  isInternalTx: true,
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  const ten6 = new BigNumber(10).pow(6)

  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const mnemonic = cryptoUtils.generateMnemonic()

  const { pkh: address, sk: privateKey } = await cryptoUtils.generateKeys(
    mnemonic,
    undefined,
    derivationPath
  )

  return {
    mnemonic,
    address,
    privateKey,
  }
}

export const importRecoveryPhrase = async (mnemonic: string): Promise<TGenerateAddress | null> => {
  const { pkh: address, sk: privateKey } = await cryptoUtils.generateKeys(
    mnemonic,
    undefined,
    derivationPath
  )

  return {
    mnemonic,
    address,
    privateKey,
  }
}

export const validateAddress = (address: string): boolean => {
  return cryptoUtils.checkAddress(address)
}

export const getExplorerLink = (address: string): string => {
  return `https://tzstats.com/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://tzstats.com/${hash}`
}

export const getStandingFee = (): number => {
  return formatValue(fee, 'from')
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { addressTo, privateKey, amount } = props

  if (!privateKey) {
    return null
  }

  const tezos = new Sotez('https://rpc.tzstats.com')

  await tezos.importKey(privateKey)

  const operation = {
    kind: 'transaction',
    fee,
    gas_limit: 10600,
    storage_limit: 300,
    amount: formatValue(amount, 'to'),
    destination: addressTo,
  }

  const { hash } = await tezos.sendOperation({ operation })

  return hash
}

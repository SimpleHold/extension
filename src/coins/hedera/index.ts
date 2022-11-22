import { PrivateKey } from '@hashgraph/cryptography'
import BigNumber from 'bignumber.js'

// Utils
import { activateAccount, getHederaAccountId } from '@utils/api'

// Types
import { TInternalTxProps, TGenerateAddress, TCurrencyConfig } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['hbar'],
  isInternalTx: true,
  extraIdName: 'Memo',
}

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const newKey = PrivateKey.generateED25519()

  return {
    address: '',
    privateKey: `${newKey}`,
    isNotActivated: true,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  try {
    return await getHederaAccountId(PrivateKey.fromString(privateKey).publicKey.toString())
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://app.dragonglass.me/hedera/accounts/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://app.dragonglass.me/hedera/search?q=${hash}`
}

export const activateWallet = async (chain: string, publicKey: string): Promise<string | null> => {
  return await activateAccount<string>(chain, publicKey)
}

export const validateAddress = (address: string): boolean => {
  try {
    return new RegExp('^(0.0.)[0-9]{5,40}$').test(address)
  } catch {
    return false
  }
}

export const getStandingFee = (): number => {
  return 0.005
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  return null
}

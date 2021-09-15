import { PrivateKey, Hbar, HbarUnit, Client, TransferTransaction } from '@hashgraph/sdk'
import { Buffer } from 'buffer'

// Utils
import { activateAccount, getHederaAccountId } from '@utils/api'

// Types
import { TInternalTxProps } from '../types'

export const coins: string[] = ['hbar']
export const isInternalTx = true

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Hbar.from(Number(value), HbarUnit.Tinybar).to(HbarUnit.Hbar).toNumber()
  }

  return new Hbar(value).toTinybars().toNumber()
}

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const newKey = PrivateKey.generate()

    const getAddress = await activateAccount('hedera', `${newKey.publicKey}`)

    if (getAddress) {
      return {
        address: getAddress,
        privateKey: `${newKey}`,
      }
    }

    return null
  } catch {
    return null
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

export const createInternalTx = async ({
  addressFrom,
  addressTo,
  amount,
  privateKey,
}: TInternalTxProps): Promise<string | null> => {
  try {
    const client = Client.forMainnet().setOperator(addressFrom, PrivateKey.fromString(privateKey))

    const transferTransactionResponse = await new TransferTransaction()
      .addHbarTransfer(addressFrom, Hbar.from(-Math.abs(amount), HbarUnit.Hbar))
      .addHbarTransfer(addressTo, Hbar.from(Number(amount), HbarUnit.Hbar))
      .execute(client)

    return Buffer.from(transferTransactionResponse.transactionHash).toString('hex')
  } catch {
    return null
  }
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

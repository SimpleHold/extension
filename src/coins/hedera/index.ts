import { PrivateKey, Hbar, HbarUnit, Client, TransferTransaction } from '@hashgraph/sdk'
import { Buffer } from 'buffer'

// Utils
import { activateAccount, getHederaAccountId } from '@utils/api'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['hbar'],
  isInternalTx: true,
  extraIdName: 'Memo',
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Hbar.from(Number(value), HbarUnit.Tinybar).to(HbarUnit.Hbar).toNumber()
  }

  return new Hbar(value).toTinybars().toNumber()
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  try {
    const newKey = PrivateKey.generate()

    return {
      address: '',
      privateKey: `${newKey}`,
      isNotActivated: true,
    }
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
  extraId,
}: TInternalTxProps): Promise<string | null> => {
  try {
    if (!privateKey) {
      return null
    }

    const client = Client.forMainnet().setOperator(addressFrom, PrivateKey.fromString(privateKey))

    const transferTransactionResponse = await new TransferTransaction()
      .addHbarTransfer(addressFrom, Hbar.from(-Math.abs(Number(amount)), HbarUnit.Hbar))
      .addHbarTransfer(addressTo, Hbar.from(Number(amount), HbarUnit.Hbar))
      .setTransactionMemo(extraId || '')
      .execute(client)

    return Buffer.from(transferTransactionResponse.transactionHash).toString('hex')
  } catch {
    return null
  }
}

export const activateWallet = async (chain: string, publicKey: string) => {
  const res = await activateAccount<string>(chain, publicKey)
  return res
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

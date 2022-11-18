import * as StellarSdk from 'stellar-sdk'
import BigNumber from 'bignumber.js'

// Utils
import { TFeeResponse } from '@utils/api/types'
import { getBalances } from '@coins/utils'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

const ten7 = new BigNumber(10).pow(7)
const server = new StellarSdk.Server('https://horizon.stellar.org/')

export const config: TCurrencyConfig = {
  coins: ['xlm'],
  isInternalTx: true,
  extraIdName: 'Memo',
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten7))
  }

  return Number(new BigNumber(value).multipliedBy(ten7))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const keypair = StellarSdk.Keypair.random()

  const address = keypair.publicKey()
  const privateKey = keypair.secret()

  return {
    address,
    privateKey,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return StellarSdk.Keypair.fromSecret(privateKey).publicKey()
}

export const getExplorerLink = (address: string): string => {
  return `https://stellar.expert/explorer/public/account/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://stellar.expert/explorer/public/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return StellarSdk.StrKey.isValidEd25519PublicKey(address)
  } catch {
    return false
  }
}

export const getNetworkFee = async (): Promise<TFeeResponse | null> => {
  try {
    return {
      networkFee: formatValue(StellarSdk.BASE_FEE, 'from'),
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const createInternalTx = async ({
  addressTo,
  amount,
  privateKey,
  extraId,
}: TInternalTxProps): Promise<string | null> => {
  if (!privateKey) {
    return null
  }

  const sourceKeypair = StellarSdk.Keypair.fromSecret(privateKey)
  const sourcePublicKey = sourceKeypair.publicKey()

  const account = await server.loadAccount(sourcePublicKey)

  const params: StellarSdk.TransactionBuilder.TransactionBuilderOptions = {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  }

  if (extraId) {
    params.memo = new StellarSdk.Memo('text', extraId)
  }

  let operation: StellarSdk.xdr.Operation<StellarSdk.Operation> = StellarSdk.Operation.payment({
    destination: addressTo,
    asset: StellarSdk.Asset.native(),
    amount: `${amount}`,
  })

  const fetchBalance = await getBalances([
    {
      symbol: 'xlm',
      address: addressTo,
      tokenSymbol: 'gas',
      chain: 'stellar',
    },
  ])

  if (fetchBalance && fetchBalance[0].balanceInfo.balance < 1.00001) {
    operation = StellarSdk.Operation.createAccount({
      startingBalance: `${amount}`,
      destination: addressTo,
    })
  }

  const transaction = new StellarSdk.TransactionBuilder(account, params)
    .addOperation(operation)
    .setTimeout(30)
    .build()

  transaction.sign(sourceKeypair)

  const transactionResult = await server.submitTransaction(transaction)

  if (transactionResult) {
    return transactionResult.hash
  }

  return null
}

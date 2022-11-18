import { KeyPair, utils, keyStores, connect } from 'near-api-js'
import BigNumber from 'bignumber.js'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['near'],
  isInternalTx: true,
}

const ten24 = new BigNumber(10).pow(24)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten24))
  }

  return Number(new BigNumber(value).multipliedBy(ten24))
}

const getAddress = (publicKey: string): string => {
  // @ts-ignore
  return utils.PublicKey.fromString(publicKey).data.toString('hex')
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const generate = KeyPair.fromRandom('ed25519')

  const privateKey = generate.toString()
  const address = getAddress(generate.getPublicKey().toString())

  return {
    privateKey,
    address,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const fromString = KeyPair.fromString(privateKey)

  return getAddress(fromString.getPublicKey().toString())
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.near.org/accounts/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.near.org/transactions/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('(^[a-z0-9_-]{2,64}\\.near$)|(^[0-9a-f]{64}$)').test(address)
}

export const getStandingFee = (): number => {
  return 0.00008
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { addressFrom, amount, privateKey, addressTo } = props

  if (!privateKey) {
    return null
  }

  const keyStore = new keyStores.InMemoryKeyStore()
  const keyPair = KeyPair.fromString(privateKey)
  await keyStore.setKey('mainnet', addressFrom, keyPair)

  const config = {
    networkId: 'mainnet',
    keyStore,
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
  }

  const near = await connect(config)
  const senderAccount = await near.account(addressFrom)
  const { transaction } = await senderAccount.sendMoney(
    addressTo,
    // @ts-ignore
    utils.format.parseNearAmount(amount)
  )

  return transaction?.hash || null
}

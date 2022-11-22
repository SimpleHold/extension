import { Bip32Path, Bip39 } from '@iota/crypto.js'
import {
  Bech32Helper,
  Ed25519Address,
  Ed25519Seed,
  ED25519_ADDRESS_TYPE,
  generateBip44Address,
  SingleNodeClient,
  send,
} from '@iota/iota.js'
import { Converter } from '@iota/util.js'
import BigNumber from 'bignumber.js'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['miota'],
  wordsSize: [24],
  isWithPhrase: true,
  isInternalTx: true,
  isZeroFee: true,
}

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

const getAccount = (recoveryPhrase?: string): TGenerateAddress => {
  const mnemonic = recoveryPhrase || Bip39.randomMnemonic()
  const baseSeed = Ed25519Seed.fromMnemonic(mnemonic)

  const path = generateBip44Address({
    accountIndex: 0,
    addressIndex: 0,
    isInternal: false,
  })

  const addressSeed = baseSeed.generateSeedFromPath(new Bip32Path(path))
  const addressKeyPair = addressSeed.keyPair()

  const indexEd25519Address = new Ed25519Address(addressKeyPair.publicKey)
  const indexPublicKeyAddress = indexEd25519Address.toAddress()

  const address = Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, indexPublicKeyAddress, 'iota')
  const privateKey = Converter.bytesToHex(addressKeyPair.privateKey)

  return {
    mnemonic,
    address,
    privateKey,
  }
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  return getAccount()
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  return getAccount(recoveryPhrase)
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.iota.org/mainnet/addr/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.iota.org/mainnet/message/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(iota)[0-9a-z]{60}$').test(address)
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { mnemonic, addressTo, amount } = props

  if (!mnemonic) {
    return null
  }

  const client = new SingleNodeClient('https://chrysalis-nodes.iota.org')

  const { messageId } = await send(
    client,
    Ed25519Seed.fromMnemonic(mnemonic),
    0,
    addressTo,
    formatValue(amount, 'to')
  )

  return messageId
}

import * as bip39 from 'bip39'
import * as serializationLib from '@emurgo/cardano-serialization-lib-asmjs'
import { BigNumber } from 'bignumber.js'

export const coins = ['ada']

const harden = (num: number): number => {
  return 0x80000000 + num
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const mnemonic = bip39.generateMnemonic(256)
    const entropy = bip39.mnemonicToEntropy(mnemonic)
    const rootKey = serializationLib.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from('')
    )
    const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
    const utxoKey = accountKey.derive(0).derive(0)
    const utxoPublicKey = utxoKey.to_public()
    const stakePublicKey = accountKey.derive(2).derive(0).to_public()
    const address = serializationLib.BaseAddress.new(
      serializationLib.NetworkInfo.mainnet().network_id(),
      serializationLib.StakeCredential.from_keyhash(utxoPublicKey.to_raw_key().hash()),
      serializationLib.StakeCredential.from_keyhash(stakePublicKey.to_raw_key().hash())
    )
      .to_address()
      .to_bech32()
    const privateKey = utxoKey.to_bech32()

    return {
      address,
      privateKey,
      mnemonic,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): null | string => {
  try {
    const rootKey = serializationLib.Bip32PrivateKey.from_bech32(privateKey)
    const utxoKey = rootKey.derive(0).derive(0)
    const utxoPublicKey = utxoKey.to_public()
    const stakePublicKey = rootKey.derive(2).derive(0).to_public()
    let address = serializationLib.BaseAddress.new(
      serializationLib.NetworkInfo.mainnet().network_id(),
      serializationLib.StakeCredential.from_keyhash(utxoPublicKey.to_raw_key().hash()),
      serializationLib.StakeCredential.from_keyhash(stakePublicKey.to_raw_key().hash())
    ).to_address()

    return address.to_bech32()
  } catch {
    return null
  }
}

export const getExplorerLink = (address: string): string => {
  return `https://cardanoscan.io/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://cardanoscan.io/transaction/${hash}`
}

const ten6 = new BigNumber(10).pow(6)

export const toAda = (value: string | number): number => {
  return Number(new BigNumber(value).div(ten6))
}

export const fromAda = (value: string | number): number => {
  return Number(new BigNumber(value).multipliedBy(ten6))
}

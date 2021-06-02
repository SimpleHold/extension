import * as bip39 from 'bip39'
import * as serializationLib from '@emurgo/cardano-serialization-lib-asmjs'

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

export const importMnemonic = (mnemonic: string): null | string => {
  try {
    const entropy = bip39.mnemonicToEntropy(mnemonic)
    const rootKey = serializationLib.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from('')
    )

    const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
    const utxoPubKey = accountKey.derive(0).derive(0).to_public()
    const stakeKey = accountKey.derive(2).derive(0).to_public()

    return serializationLib.BaseAddress.new(
      serializationLib.NetworkInfo.mainnet().network_id(),
      serializationLib.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
      serializationLib.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
    )
      .to_address()
      .to_bech32()
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  return new RegExp(
    '^(([1-9A-HJ-NP-Za-km-z]{59})|([0-9A-Za-z]{100,104}))$|^(addr)[0-9A-Za-z]{45,65}$'
  ).test(address)
}

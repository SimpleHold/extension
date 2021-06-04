import * as bip39 from 'bip39'
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-asmjs'
import { BigNumber } from 'bignumber.js'

export const coins = ['ada']

// Do not send money to this address!
const testWallet = {
  address:
    'addr1q8j2yamnmsf3uevcmrcnzm4uv5tq46zzachqpql08l0vhrsa2ald8tuls2ddfggjj3dz0sq9gv2f4msu9t539ng3xk3sse5dty',
  privateKey:
    'xprv1erx3qfz40et93vmsfcuq9p3frucm8yfvu8yanqfp3j8zu8jasef6degjd7hj9q9gzw89kjaht0uuc6ky4fz6gw0nrsmklv3c5zwkp7em60mqlyv4e6kk0p6k9rqn9ry6s0ry6f7mtfu23l9n4nke2w05mgls4jkq',
}

const harden = (num: number): number => {
  return 0x80000000 + num
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const mnemonic = bip39.generateMnemonic(256)
    const entropy = bip39.mnemonicToEntropy(mnemonic)
    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from('')
    )
    const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
    const utxoKey = accountKey.derive(0).derive(0)
    const utxoPublicKey = utxoKey.to_public()
    const stakePublicKey = accountKey.derive(2).derive(0).to_public()
    const address = CardanoWasm.BaseAddress.new(
      CardanoWasm.NetworkInfo.mainnet().network_id(),
      CardanoWasm.StakeCredential.from_keyhash(utxoPublicKey.to_raw_key().hash()),
      CardanoWasm.StakeCredential.from_keyhash(stakePublicKey.to_raw_key().hash())
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
    const rootKey = CardanoWasm.Bip32PrivateKey.from_bech32(privateKey)
    const utxoKey = rootKey.derive(0).derive(0)
    const utxoPublicKey = utxoKey.to_public()
    const stakePublicKey = rootKey.derive(2).derive(0).to_public()
    const address = CardanoWasm.BaseAddress.new(
      CardanoWasm.NetworkInfo.mainnet().network_id(),
      CardanoWasm.StakeCredential.from_keyhash(utxoPublicKey.to_raw_key().hash()),
      CardanoWasm.StakeCredential.from_keyhash(stakePublicKey.to_raw_key().hash())
    )

    return address.to_address().to_bech32()
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

interface IUnspentTxOutput {
  ctaAddress: string
  ctaAmount: {
    getCoin: string
  }
  ctaTxHash: string
  ctaTxIndex: number
}

const getTxBuilder = (): CardanoWasm.TransactionBuilder => {
  return CardanoWasm.TransactionBuilder.new(
    CardanoWasm.LinearFee.new(
      CardanoWasm.BigNum.from_str('44'),
      CardanoWasm.BigNum.from_str('155381')
    ),
    CardanoWasm.BigNum.from_str('1000000'),
    CardanoWasm.BigNum.from_str('500000000'),
    CardanoWasm.BigNum.from_str('2000000')
  )
}

const calculateFee = (outputs: IUnspentTxOutput[], amount: number): number => {
  const txBuilder = getTxBuilder()

  const outputAddress = CardanoWasm.Address.from_bech32(testWallet.address)
  const signingKey = CardanoWasm.Bip32PrivateKey.from_bech32(testWallet.privateKey).to_raw_key()

  for (const output of outputs) {
    const {
      ctaAmount: { getCoin: inputAmount },
      ctaTxHash: inputHash,
      ctaTxIndex: inputIndex,
    } = output
    const txHashBuffer = Buffer.from(inputHash, 'hex')
    const taxHashBufferArray = new Uint8Array(
      txHashBuffer.buffer,
      txHashBuffer.byteOffset,
      txHashBuffer.byteLength
    )
    txBuilder.add_key_input(
      signingKey.to_public().hash(),
      CardanoWasm.TransactionInput.new(
        CardanoWasm.TransactionHash.from_bytes(taxHashBufferArray),
        inputIndex
      ),
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(inputAmount))
    )
  }

  txBuilder.set_ttl(432000)

  txBuilder.add_output(
    CardanoWasm.TransactionOutput.new(
      outputAddress,
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(`${fromAda(amount)}`))
    )
  )

  txBuilder.add_change_if_needed(CardanoWasm.Address.from_bech32(testWallet.address))

  return +txBuilder.min_fee().to_str()
}

export const getNetworkFee = (outputs: IUnspentTxOutput[], amount: number) => {
  const sortOutputs = outputs.sort(
    (a: IUnspentTxOutput, b: IUnspentTxOutput) =>
      Number(a.ctaAmount.getCoin) - Number(b.ctaAmount.getCoin)
  )

  const selectedOutputs: IUnspentTxOutput[] = []

  for (const output of sortOutputs) {
    const getTotalValue = selectedOutputs.reduce((a, b) => a + Number(b.ctaAmount.getCoin), 0)

    if (getTotalValue >= fromAda(amount)) {
      break
    }

    selectedOutputs.push(output)

    return {
      networkFee: calculateFee(selectedOutputs, amount),
      selectedOutputs,
    }
  }
}

const validateByronAddress = (address: string) => {
  try {
    const byronAddress = CardanoWasm.ByronAddress.from_base58(address)

    if (byronAddress) {
      return true
    }
  } catch {
    return false
  }
}

const validateShelleyAddress = (address: string) => {
  try {
    const shelleyAddress = CardanoWasm.Address.from_bech32(address)

    if (shelleyAddress) {
      return true
    }
  } catch {
    return false
  }
}

export const validateAddress = (address: string) => {
  return validateByronAddress(address) || validateShelleyAddress(address)
}

const prepareAddress = (address: string): CardanoWasm.Address | null => {
  if (validateShelleyAddress(address)) {
    return CardanoWasm.Address.from_bech32(address)
  }
  return null
}

const addOutputs = (
  txBuilder: CardanoWasm.TransactionBuilder,
  outputs: IUnspentTxOutput[],
  signingKey: CardanoWasm.PrivateKey
) => {
  for (const output of outputs) {
    const {
      ctaAmount: { getCoin: inputAmount },
      ctaTxHash: inputHash,
      ctaTxIndex: inputIndex,
    } = output

    const txHashBuffer = Buffer.from(inputHash, 'hex')

    const taxHashBufferArray = new Uint8Array(
      txHashBuffer.buffer,
      txHashBuffer.byteOffset,
      txHashBuffer.byteLength
    )

    txBuilder.add_key_input(
      signingKey.to_public().hash(),
      CardanoWasm.TransactionInput.new(
        CardanoWasm.TransactionHash.from_bytes(taxHashBufferArray),
        inputIndex
      ),
      CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(inputAmount))
    )
  }

  return txBuilder
}

export const createTransaction = (
  outputs: IUnspentTxOutput[],
  from: string,
  to: string,
  amount: number,
  privateKey: string
) => {
  try {
    const txBuilder = getTxBuilder()

    const parseAmount = fromAda(amount)
    const addressFrom = prepareAddress(from)
    const addressTo = prepareAddress(to)

    if (addressFrom && addressTo) {
      const signingKey = CardanoWasm.Bip32PrivateKey.from_bech32(privateKey).to_raw_key()

      addOutputs(txBuilder, outputs, signingKey)
      txBuilder.set_ttl(432000)

      txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
          addressTo,
          CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(`${parseAmount}`))
        )
      )

      txBuilder.add_change_if_needed(addressFrom)

      const txBody = txBuilder.build()
      const txHash = CardanoWasm.hash_transaction(txBody)
      const witnesses = CardanoWasm.TransactionWitnessSet.new()
      const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new()
      const vkeyWitness = CardanoWasm.make_vkey_witness(txHash, signingKey)
      vkeyWitnesses.add(vkeyWitness)
      witnesses.set_vkeys(vkeyWitnesses)

      const transaction = CardanoWasm.Transaction.new(txBody, witnesses, undefined)

      return Buffer.from(transaction.to_bytes()).toString('hex')
    }
    return null
  } catch {
    return null
  }
}

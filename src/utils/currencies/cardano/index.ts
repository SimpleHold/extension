import * as bip39 from 'bip39'
import { BigNumber } from 'bignumber.js'

let CardanoWasm: any = null

import('@emurgo/cardano-serialization-lib-browser').then((module) => {
  CardanoWasm = module
})

export const coins = ['ada']

import { getCardanoTransactionParams } from '@utils/api'

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

export const importRecoveryPhrase = (recoveryPhrase: string): TGenerateAddress | null => {
  try {
    const entropy = bip39.mnemonicToEntropy(recoveryPhrase)
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
      mnemonic: recoveryPhrase,
    }
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

export const fromAda = (value: string | number): number => {
  return Number(new BigNumber(value).div(ten6))
}

export const toAda = (value: string | number): number => {
  return Number(new BigNumber(value).multipliedBy(ten6))
}

const getTxBuilder = () => {
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

const calculateFee = (
  outputs: CardanoUnspentTxOutput[],
  amount: number | string,
  ttl: number
): number => {
  try {
    const txBuilder = getTxBuilder()
    const testWallet = generateWallet()

    if (testWallet) {
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

      txBuilder.set_ttl(ttl)

      txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
          outputAddress,
          CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(`${toAda(amount)}`))
        )
      )

      try {
        txBuilder.add_change_if_needed(CardanoWasm.Address.from_bech32(testWallet.address))
      } catch {}

      return +txBuilder.min_fee().to_str()
    }

    return 0
  } catch {
    return 0
  }
}

export const getNetworkFee = async (outputs: any[], amount: string | number) => {
  try {
    const transactionParams = await getCardanoTransactionParams()

    if (transactionParams) {
      const { ttl } = transactionParams

      const sortOutputs = outputs.sort(
        (a: CardanoUnspentTxOutput, b: CardanoUnspentTxOutput) =>
          Number(a.ctaAmount.getCoin) - Number(b.ctaAmount.getCoin)
      )

      const selectedOutputs: CardanoUnspentTxOutput[] = []

      for (const output of sortOutputs) {
        const getTotalValue = selectedOutputs.reduce((a, b) => a + Number(b.ctaAmount.getCoin), 0)
        const fee = calculateFee([...selectedOutputs, output], amount, ttl)

        if (getTotalValue >= toAda(amount) + fee) {
          break
        }

        selectedOutputs.push(output)
      }

      return {
        networkFee: fromAda(calculateFee(selectedOutputs, amount, ttl)),
        utxos: selectedOutputs,
      }
    }

    return null
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => {
  try {
    const shelleyAddress = CardanoWasm.Address.from_bech32(address)

    if (shelleyAddress) {
      return true
    }
    return false
  } catch {
    return false
  }
}

const prepareAddress = (address: string) => {
  if (validateAddress(address)) {
    return CardanoWasm.Address.from_bech32(address)
  }
  return null
}

const addOutputs = (txBuilder: any, outputs: any[], signingKey: any) => {
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

export const createTransaction = async (
  outputs: any[],
  from: string,
  to: string,
  amount: number,
  privateKey: string
) => {
  try {
    const transactionParams = await getCardanoTransactionParams()

    if (transactionParams) {
      const { ttl } = transactionParams

      const txBuilder = getTxBuilder()

      const addressFrom = prepareAddress(from)
      const addressTo = prepareAddress(to)

      if (addressFrom && addressTo) {
        const signingKey = CardanoWasm.Bip32PrivateKey.from_bech32(privateKey).to_raw_key()

        addOutputs(txBuilder, outputs, signingKey)
        txBuilder.set_ttl(ttl)

        txBuilder.add_output(
          CardanoWasm.TransactionOutput.new(
            addressTo,
            CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(`${amount}`))
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
    }
    return null
  } catch {
    return null
  }
}

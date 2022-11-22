import * as solanaWeb3 from '@solana/web3.js'
import * as solanaSpl from '@solana/spl-token'
import BigNumber from 'bignumber.js'
import bs58 from 'bs58'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['sol'],
  isInternalTx: true,
}

const ten9 = new BigNumber(10).pow(9)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten9))
  }

  return Number(new BigNumber(value).multipliedBy(ten9))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const wallet = solanaWeb3.Keypair.generate()

  return {
    address: wallet.publicKey.toString(),
    privateKey: bs58.encode(wallet.secretKey),
  }
}

const getKeypairFromPrivateKey = (privateKey: string): solanaWeb3.Keypair | null => {
  try {
    return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)))
  } catch {
    try {
      return solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)))
    } catch {
      return null
    }
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const keyPair = getKeypairFromPrivateKey(privateKey)

  if (keyPair) {
    return keyPair.publicKey.toString()
  }

  return null
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.solana.com/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.solana.com/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    new solanaWeb3.PublicKey(address)
    return true
  } catch {
    return false
  }
}

const addressToPubKey = (address: string): solanaWeb3.PublicKey => {
  return new solanaWeb3.PublicKey(address)
}

export const getStandingFee = (): number => {
  return 0.000005
}

const transferToken = async (params: TInternalTxProps): Promise<string | null> => {
  try {
    const { contractAddress, privateKey, addressTo, amount, addressFrom, decimals } = params

    if (!privateKey) {
      return null
    }

    const keyPair = getKeypairFromPrivateKey(privateKey)

    if (contractAddress && keyPair && decimals) {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
      )

      const value = Number(new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)))

      const token = new solanaSpl.Token(
        connection,
        new solanaWeb3.PublicKey(contractAddress),
        solanaSpl.TOKEN_PROGRAM_ID,
        keyPair
      )

      const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
        addressToPubKey(addressFrom)
      )

      const associatedDestinationTokenAddr = await solanaSpl.Token.getAssociatedTokenAddress(
        token.associatedProgramId,
        token.programId,
        new solanaWeb3.PublicKey(contractAddress),
        addressToPubKey(addressTo)
      )

      const receiverAccount = await connection.getAccountInfo(addressToPubKey(addressTo))

      const instructions: solanaWeb3.TransactionInstruction[] = []

      if (
        receiverAccount !== null &&
        receiverAccount.owner.toBase58() !== addressToPubKey(addressTo).toBase58()
      ) {
        instructions.push(
          solanaSpl.Token.createSetAuthorityInstruction(
            solanaSpl.TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            addressToPubKey(addressTo),
            'AccountOwner',
            keyPair.publicKey,
            []
          )
        )
      } else {
        if (receiverAccount === null) {
          instructions.push(
            solanaSpl.Token.createAssociatedTokenAccountInstruction(
              token.associatedProgramId,
              token.programId,
              new solanaWeb3.PublicKey(contractAddress),
              associatedDestinationTokenAddr,
              addressToPubKey(addressTo),
              keyPair.publicKey
            )
          )
        }

        instructions.push(
          solanaSpl.Token.createTransferInstruction(
            solanaSpl.TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            associatedDestinationTokenAddr,
            keyPair.publicKey,
            [],
            value
          )
        )
      }

      const transaction = new solanaWeb3.Transaction().add(...instructions)

      return await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [keyPair])
    }

    return null
  } catch {
    return null
  }
}

export const createInternalTx = async (params: TInternalTxProps): Promise<string | null> => {
  try {
    const { addressFrom, addressTo, amount, privateKey, contractAddress } = params

    if (privateKey) {
      if (contractAddress) {
        return await transferToken(params)
      }

      const keyPair = getKeypairFromPrivateKey(privateKey)

      if (keyPair) {
        const connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl('mainnet-beta'),
          'confirmed'
        )

        const transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: addressToPubKey(addressFrom),
            toPubkey: addressToPubKey(addressTo),
            lamports: formatValue(amount, 'to'),
          })
        )

        const sendTx = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [
          keyPair,
        ])

        return sendTx
      }
    }

    return null
  } catch {
    return null
  }
}

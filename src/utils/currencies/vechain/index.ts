import * as Devkit from 'thor-devkit'
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { thorify } from 'thorify'

// Utils
import { getBalance, getVechainParams, getVechainFee } from '@utils/api'
import { toLower, toUnit } from '@utils/format'

// Config
import contractABI from '@config/contractABI'

// Types
import { TGetFeeData } from '../types'

const ten18 = new BigNumber(10).pow(18)
const VTHO_CA = '0x0000000000000000000000000000456E65726779'
const providerUrl = 'https://mainnet.veblocks.net/'
const web3Instance = thorify(new Web3(), providerUrl)

export const coins: string[] = ['vet', 'vtho']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privKey = Devkit.secp256k1.generatePrivateKey()
    const pubKey = Devkit.secp256k1.derivePublicKey(privKey)
    const address = Devkit.address.fromPublicKey(pubKey)

    return {
      privateKey: privKey.toString('hex'),
      address,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const pubKey = Devkit.secp256k1.derivePublicKey(Buffer.from(privateKey, 'hex'))

    return Devkit.address.fromPublicKey(pubKey)
  } catch {
    return null
  }
}
export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten18))
  }

  return Number(new BigNumber(value).multipliedBy(ten18))
}

export const getExplorerLink = (address: string): string => {
  return `https://explore.vechain.org/accounts/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explore.vechain.org/transactions/${hash}#info`
}

export const getNetworkFee = async (
  from: string,
  to: string,
  amount: string,
  chain: string
): Promise<TGetFeeData> => {
  try {
    const { balance: currencyBalance } = await getBalance(from, 'vechain')

    if (chain === 'vechain') {
      const fee = Devkit.Transaction.intrinsicGas([
        {
          to,
          value: formatValue(amount, 'from'),
          data: '0x',
        },
      ])

      return {
        networkFee: toUnit(fee, 5),
        currencyBalance,
      }
    }

    const networkFee = await getVechainFee(from, to, `${formatValue(amount, 'to')}`)

    const vthoTransferPrice = 0.52
    const fee = Math.ceil((networkFee + vthoTransferPrice) * 10000) / 10000

    return {
      networkFee: fee,
      currencyBalance,
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

const transferToken = async (
  from: string,
  to: string,
  value: string,
  privateKey: string
): Promise<string | null> => {
  const contract = new web3Instance.eth.Contract(contractABI, VTHO_CA, { from })
  const data = contract.methods.transfer(to, value)

  const { rawTransaction } = await web3Instance.eth.accounts.signTransaction(
    {
      to: VTHO_CA,
      data: data.encodeABI(),
    },
    privateKey
  )

  return rawTransaction || null
}

export const createTransaction = async (
  from: string,
  to: string,
  value: string,
  privateKey: string,
  symbol: string
): Promise<string | null> => {
  try {
    if (toLower(symbol) === 'vtho') {
      return await transferToken(from, to, value, privateKey)
    }

    const clauses = [
      {
        to,
        value,
        data: '0x',
      },
    ]

    const txParams = await getVechainParams()

    if (!txParams?.blockRef) {
      return null
    }

    const tx = new Devkit.Transaction({
      chainTag: 74,
      blockRef: txParams.blockRef,
      clauses,
      expiration: 32,
      gasPriceCoef: 128,
      gas: Devkit.Transaction.intrinsicGas(clauses),
      dependsOn: null,
      nonce: +new Date(),
    })
    const signingHash = tx.signingHash()
    tx.signature = Devkit.secp256k1.sign(signingHash, Buffer.from(privateKey, 'hex'))

    return `0x${tx.encode().toString('hex')}`
  } catch {
    return null
  }
}

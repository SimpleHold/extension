import * as Devkit from 'thor-devkit'
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { thorify } from 'thorify'

// Utils
import { getVechainParams, getVechainFee, fetchBalances } from '@utils/api'
import { toLower, toUnit } from '@utils/format'

// Config
import contractABI from '@config/contractABI'

// Types
import { TGenerateAddress, TCurrencyConfig, TFeeProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

const ten18 = new BigNumber(10).pow(18)
const VTHO_CA = '0x0000000000000000000000000000456E65726779'

const web3Instance = thorify(new Web3(), 'https://mainnet.veblocks.net/')

export const config: TCurrencyConfig = {
  coins: ['vet', 'vtho'],
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
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

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
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

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(0x)[0-9A-Fa-f]{40}$').test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse> => {
  try {
    const { from, chain, amount } = props

    const to = (await generateAddress())?.address

    if (!to) {
      return {
        networkFee: 0,
      }
    }

    const data = await fetchBalances([{ address: from, chain: 'vethor' }])
    const { balance: currencyBalance } = data[0].balanceInfo

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

    const safeRequestAmount = amount.length > 17 ? Number(amount.slice(0, 17)) : amount
    const networkFee = await getVechainFee(from, to, `${formatValue(safeRequestAmount, 'to')}`)

    return {
      networkFee,
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

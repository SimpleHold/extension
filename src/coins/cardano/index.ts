import { mnemonicToRootKeypair } from 'cardano-crypto.js'
import { generateMnemonic } from 'bip39'
import BigNumber from 'bignumber.js'

// Utils
import { getCryptoProvider, baseAddressFromXpub } from './utils'
import getFee from './getNetworkFee'
import createCardanoTx from './createCardanoTx'
import { getTxParams } from '@utils/api'

// Config
import { shelleyPath, shelleyStakeAccountPath } from './config'

// Types
import { TCurrencyConfig, TGenerateAddress, TFeeProps, TCreateTxProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['ada'],
  isWithOutputs: true,
  isWithPhrase: true,
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  const ten6 = new BigNumber(10).pow(6)

  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const mnemonic = generateMnemonic(256)

  const address = await getAddressFromMnemonic(mnemonic)

  return {
    address,
    privateKey: '',
    mnemonic,
  }
}

export const importRecoveryPhrase = async (mnemonic: string): Promise<TGenerateAddress | null> => {
  const address = await getAddressFromMnemonic(mnemonic)

  return {
    address,
    privateKey: '',
    mnemonic,
  }
}

const getAddressFromMnemonic = async (mnemonic: string): Promise<string> => {
  const rootSecret = await mnemonicToRootKeypair(mnemonic, 2)

  const cryptoProvider = await getCryptoProvider(rootSecret)
  const spendXpub = await cryptoProvider.deriveXpub(shelleyPath)
  const stakeXpub = await cryptoProvider.deriveXpub(shelleyStakeAccountPath)

  return baseAddressFromXpub(spendXpub, stakeXpub)
}

export const getExplorerLink = (address: string): string => {
  return `https://cardanoscan.io/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://cardanoscan.io/transaction/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp(
    '^((addr)([1-9A-HJ-NP-Za-km-z]{59})|([0-9A-Za-z]{100,104}))$|^(addr)[0-9A-Za-z]{45,65}$'
  ).test(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse> => {
  try {
    const { outputs, amount, addressFrom } = props

    const getFeeRequest = await getFee(
      +formatValue(amount, 'to'),
      addressFrom,
      addressFrom,
      outputs
    )

    if (getFeeRequest?.success) {
      const { baseFee } = getFeeRequest.txPlan

      return {
        networkFee: formatValue(baseFee, 'from'),
        utxos: getFeeRequest.txPlan.inputs as any,
      }
    }

    return {
      networkFee: 0,
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const createTx = async (props: TCreateTxProps): Promise<string | null> => {
  const txParams = await getTxParams('cardano')

  if (txParams) {
    const { ttl } = txParams

    return await createCardanoTx(props, ttl)
  }

  return null
}

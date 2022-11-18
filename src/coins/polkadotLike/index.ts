import { Keyring, ApiPromise, WsProvider } from '@polkadot/api'
import { mnemonicGenerate, mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto'
import { waitReady } from '@polkadot/wasm-crypto'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { BN, hexToU8a, isHex } from '@polkadot/util'
import BigNumber from 'bignumber.js'

// Utils
import { getNetworkFeeRequest } from '@utils/api'
import { toLower } from '@utils/format'

// Config
import chains from './chains'

// Types
import { TGenerateAddress, TCurrencyConfig, TFeeProps, TInternalTxProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'
import { TChain } from './types'

export const config: TCurrencyConfig = {
  coins: chains.map((item: TChain) => item.symbol),
  isWithPhrase: true,
  wordsSize: [12],
  isInternalTx: true,
}

const getDecimals = (symbol: string): number => {
  return chains.find((item: TChain) => toLower(item.symbol) === toLower(symbol))?.decimals || 10
}

export const formatValue = (
  value: string | number,
  type: 'from' | 'to',
  symbol: string
): number => {
  const bnZeros = new BigNumber(10).pow(getDecimals(symbol))

  if (type === 'from') {
    return Number(new BigNumber(value).div(bnZeros))
  }

  return Number(new BigNumber(value).multipliedBy(bnZeros))
}

const getChain = (chain: string): TChain | undefined => {
  return chains.find((item: TChain) => item.chain === chain)
}

export const generateAddress = async (
  symbol: string,
  chain: string
): Promise<TGenerateAddress | null> => {
  await waitReady()
  await cryptoWaitReady()

  const chainInfo = getChain(chain)

  if (!chainInfo) {
    return null
  }

  const { ss58Format, keypairType, path } = chainInfo

  const mnemonic = mnemonicGenerate()

  const keyring = new Keyring({ ss58Format })
  const suri = path ? `${mnemonic}/${path}` : mnemonic

  const { address } = keyring.createFromUri(suri, undefined, keypairType)

  return {
    address,
    privateKey: '',
    mnemonic,
  }
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string,
  symbol: string,
  chain: string
): Promise<TGenerateAddress | null> => {
  if (mnemonicValidate(recoveryPhrase)) {
    await waitReady()
    await cryptoWaitReady()

    const chainInfo = getChain(chain)

    if (!chainInfo) {
      return null
    }

    const { ss58Format, keypairType, path } = chainInfo

    const keyring = new Keyring({ ss58Format })
    const suri = path ? `${recoveryPhrase}/${path}` : recoveryPhrase

    const { address } = keyring.createFromUri(suri, undefined, keypairType)

    return {
      address,
      privateKey: '',
      mnemonic: recoveryPhrase,
    }
  }

  return null
}

export const getTransactionLink = (hash: string, chain: string): string => {
  return `https://${chain}.subscan.io/extrinsic/${hash}`
}

export const getExplorerLink = (address: string, chain: string): string => {
  return `https://${chain}.subscan.io/account/${address}`
}

export const validateAddress = (address: string): boolean => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch {
    return false
  }
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { addressFrom, amount, chain } = props

  return await getNetworkFeeRequest(chain, addressFrom, amount)
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { amount, mnemonic, addressTo, chain, symbol } = props

  const chainInfo = getChain(chain)

  if (mnemonic && chainInfo) {
    await waitReady()
    await cryptoWaitReady()

    const { keypairType, wsUrl, ss58Format, path } = chainInfo

    const provider = new WsProvider(wsUrl)
    const api = await ApiPromise.create({
      provider,
      throwOnConnect: false,
      throwOnUnknown: false,
    })

    const keyring = new Keyring({ ss58Format })
    const suri = path ? `${mnemonic}/${path}` : mnemonic
    const sender = keyring.createFromUri(suri, undefined, keypairType)

    const bnZeros = new BigNumber(10).pow(getDecimals(symbol))
    const formatAmount = new BN(new BigNumber(amount).multipliedBy(bnZeros).toString())

    const transfer = api.tx.balances.transfer(addressTo, formatAmount)
    const hash = await transfer.signAndSend(sender)

    return hash.toHex()
  }

  return null
}

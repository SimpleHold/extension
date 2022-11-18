import { wallet, api, u, sc } from '@cityofzion/neon-js'
import BigNumber from 'bignumber.js'
import flatMap from 'lodash/flatMap'

// Utils
import { TFeeResponse } from '@utils/api/types'
import { toUpper } from '@utils/format'
import { getBalances } from '@coins/utils'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps, TFeeProps } from '@coins/types'
import { SendEntryType, TokenBalanceType, TTxConfig } from './types'

export const config: TCurrencyConfig = {
  coins: ['neo'],
  isInternalTx: true,
}

const ten8 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const privateKey = wallet.generatePrivateKey()
  const { address } = new wallet.Account(privateKey)

  return {
    privateKey,
    address,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const { address } = new wallet.Account(privateKey)

  return address
}

export const getExplorerLink = (address: string): string => {
  return `https://neoscan.io/address/${address}/1`
}

export const getTransactionLink = (hash: string): string => {
  return `https://neoscan.io/transaction/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return wallet.isAddress(address)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { addressFrom, amount, symbol } = props

  if (Number(amount) % 1 !== 0 && symbol === 'neo') {
    return {
      networkFee: 0,
    }
  }

  const fetchBalance = await getBalances([
    {
      symbol: 'neo',
      address: addressFrom,
      tokenSymbol: 'gas',
    },
  ])

  return {
    networkFee: 0.001,
    currencyBalance: fetchBalance?.[0].balanceInfo.balance || 0,
  }
}

const isToken = (symbol: string) => !['NEO', 'GAS'].includes(symbol)

const extractAssets = (sendEntries: Array<SendEntryType>) => {
  return sendEntries.filter(({ symbol }) => !isToken(symbol))
}

export const toNumber = (value: string | number) => {
  return new BigNumber(String(value)).toNumber()
}

const buildIntents = (sendEntries: SendEntryType[]) => {
  const assetEntries = extractAssets(sendEntries)

  return flatMap(assetEntries, ({ address, amount, symbol }) =>
    api.makeIntent({ [symbol]: toNumber(amount) }, address)
  )
}

const extractTokens = (sendEntries: SendEntryType[]) => {
  return sendEntries.filter(({ symbol }) => isToken(symbol))
}

const buildTransferScript = (
  sendEntries: SendEntryType[],
  fromAddress: string,
  tokensBalanceMap: {
    [key: string]: TokenBalanceType
  }
) => {
  const tokenEntries = extractTokens(sendEntries)
  const fromAcct = new wallet.Account(fromAddress)
  const scriptBuilder = new sc.ScriptBuilder()

  tokenEntries.forEach(({ address, amount, symbol }) => {
    const toAcct = new wallet.Account(address)
    const { scriptHash } = tokensBalanceMap[symbol]
    const args = [
      u.reverseHex(fromAcct.scriptHash),
      u.reverseHex(toAcct.scriptHash),
      sc.ContractParam.byteArray(toNumber(amount), 'fixed8'),
    ]

    scriptBuilder.emitAppCall(scriptHash, 'transfer', args)
  })

  return scriptBuilder.str
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { privateKey, addressTo, amount, addressFrom, symbol, contractAddress } = props

  if (!privateKey) {
    return null
  }

  const sendEntries: SendEntryType[] = [
    {
      address: addressTo,
      amount,
      symbol: `${toUpper(symbol)}`,
    },
  ]

  const account = new wallet.Account(privateKey)

  const tokensBalanceMap: { [key: string]: TokenBalanceType } = {}
  const intents = buildIntents(sendEntries)

  if (!intents.length && contractAddress) {
    tokensBalanceMap[`${toUpper(symbol)}`] = {
      scriptHash: contractAddress,
    }
  }

  const script = buildTransferScript(sendEntries, addressFrom, tokensBalanceMap)

  const txConfig: TTxConfig = {
    account,
    address: addressFrom,
    fees: 0.001,
    net: 'MainNet',
    privateKey,
    publicKey: account.publicKey,
    url: 'https://mainnet1.neo2.coz.io:443',
    intents,
  }

  if (!script.length) {
    const { response } = await api.sendAsset(txConfig)

    // @ts-ignore
    return response?.txid || null
  }

  txConfig.script = script
  txConfig.gas = 0

  const { response } = await api.doInvoke(txConfig)

  // @ts-ignore
  return response?.txid || null
}

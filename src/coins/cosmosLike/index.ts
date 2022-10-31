import { SigningStargateClient, TimeoutError } from '@cosmjs/stargate'
import { stringToPath } from '@cosmjs/crypto'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import BigNumber from 'bignumber.js'

// Config
import { getChain } from './chains'
import cosmosLikeCoins from '@config/currencies/cosmosLike'
import { TCurrency } from '@config/currencies/types'

// Types
import { TCurrencyConfig, TGenerateAddress, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: cosmosLikeCoins.map((coin: TCurrency) => coin.symbol),
  isWithPhrase: true,
  isInternalTx: true,
  wordsSize: [12],
  extraIdName: 'Memo',
}

export const formatValue = (
  value: string | number,
  type: 'from' | 'to',
  symbol: string
): number => {
  const bnDecimals = new BigNumber(10).pow(getDecimals(symbol))

  if (type === 'from') {
    return Number(new BigNumber(value).div(bnDecimals))
  }

  return Number(new BigNumber(value).multipliedBy(bnDecimals))
}

const getDecimals = (symbol: string): number => {
  if (symbol === 'fet' || symbol === 'evmos' || symbol === 'rowan') {
    return 18
  }

  if (symbol === 'cro') {
    return 8
  }

  return 6
}

export const generateAddress = async (
  symbol: string,
  chain: string
): Promise<TGenerateAddress | null> => {
  const chainInfo = getChain(chain)

  if (chainInfo) {
    const { prefix, hdPaths } = chainInfo

    const wallet = await DirectSecp256k1HdWallet.generate(12, {
      prefix,
      hdPaths: [stringToPath(hdPaths)],
    })

    const [{ address }] = await wallet.getAccounts()

    return {
      mnemonic: wallet.mnemonic,
      privateKey: '',
      address,
    }
  }

  return null
}

const getWallet = async (
  mnemonic: string,
  path: string,
  prefix: string
): Promise<DirectSecp256k1HdWallet> => {
  return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix,
    hdPaths: [stringToPath(path)],
  })
}

export const importRecoveryPhrase = async (
  mnemonic: string,
  symbol: string,
  chain: string
): Promise<TGenerateAddress | null> => {
  const chainInfo = getChain(chain)

  if (chainInfo) {
    const { hdPaths, prefix } = chainInfo

    const wallet = await getWallet(mnemonic, hdPaths, prefix)

    const [{ address }] = await wallet.getAccounts()

    return {
      address,
      privateKey: '',
      mnemonic,
    }
  }

  return null
}

export const validateAddress = (address: string, symbol: string, chain: string): boolean => {
  const chainInfo = getChain(chain)

  if (chainInfo) {
    return new RegExp(`^(${chainInfo.prefix})[0-9A-Za-z]{30,70}$`).test(address)
  }

  return false
}

export const getExplorerLink = (address: string, chain: string): string => {
  return `https://www.mintscan.io/${chain}/account/${address}`
}

export const getTransactionLink = (hash: string, chain: string): string => {
  return `https://www.mintscan.io/${chain}/txs/${hash}`
}

export const getStandingFee = (symbol: string, chain: string): number => {
  const chainInfo = getChain(chain)

  if (chainInfo) {
    return chainInfo.standingFee
  }

  return 0
}

const createTx = async (props: TInternalTxProps, rpcIndex: number): Promise<string | null> => {
  const { mnemonic, addressTo, amount, extraId, networkFee, symbol } = props

  const chain = getChain(props.chain)

  if (!mnemonic || !chain) {
    return null
  }

  const { hdPaths, rpcUrls, denom, prefix, gas } = chain
  const rpcUrl = rpcUrls[rpcIndex]

  try {
    const wallet = await getWallet(mnemonic, hdPaths, prefix)
    const [{ address }] = await wallet.getAccounts()

    const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet)

    const txAmount = [
      {
        denom,
        amount: `${formatValue(amount, 'to', symbol)}`,
      },
    ]

    const txFee = {
      amount: [
        {
          denom,
          amount: `${formatValue(networkFee, 'to', symbol)}`,
        },
      ],
      gas,
    }

    const { transactionHash } = await client.sendTokens(
      address,
      addressTo,
      txAmount,
      txFee,
      extraId
    )

    return transactionHash
  } catch (err: any) {
    if (err instanceof TimeoutError) {
      return err.txId
    }

    if (
      `${err}` ===
      'Error: {"code":-32603,"message":"Internal error","data":"tx already exists in cache"}'
    ) {
      return ''
    }

    if (rpcUrls[rpcIndex + 1]) {
      return await createTx(props, rpcIndex + 1)
    }

    return null
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  return await createTx(props, 0)
}

// Config
import addressValidate from '@config/addressValidate'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getSharedToken, getToken } from '@config/tokens'
import { GENERAL_BALANCE_CHANGE } from '@config/events'

// Utils
import {
  getEtherNetworkFee,
  getThetaNetworkFee,
  getNetworkFee as getNetworkFeeRequest,
  getCustomFee, fetchBalances,
} from '@utils/api'
import { toLower } from '@utils/format'
import {
  getBalanceDiff,
  getBalancePrecision,
  getLatestBalance,
  getSingleWallet,
  getWalletChain,
  saveBalanceData, TBalanceData,
} from '@utils/wallet'
import { logErrorCreateTx, logErrorGenerateAddress, logErrorImportPrivateKey, logEvent } from 'utils/metrics'

// Types
import { TProvider, TCreateTransactionProps, IGetFeeParams, TGetFeeData, TCreateInternalTxProps } from './types'
import {
  IGetBalances,
  TCustomFee,
  TGetBalanceOptions,
  TGetBalanceWalletProps,
} from '@utils/api/types'

// Currencies
import * as ethereumLike from '@utils/currencies/ethereumLike'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'
import * as theta from '@utils/currencies/theta'
import * as cardano from '@utils/currencies/cardano'
import * as ripple from '@utils/currencies/ripple'
import * as neblio from '@utils/currencies/neblio'
import * as nuls from '@utils/currencies/nuls'
import * as nerve from '@utils/currencies/nerve'
import * as tron from '@utils/currencies/tron'
import * as hedera from '@utils/currencies/hedera'
import * as zilliqa from '@utils/currencies/zilliqa'
import * as verge from '@utils/currencies/verge'
import * as xinfin from '@utils/currencies/xinfin'
import * as solana from '@utils/currencies/solana'
import * as harmony from '@utils/currencies/harmony'
import * as vechain from '@utils/currencies/vechain'
import * as toncoin from '@utils/currencies/toncoin'
import * as digibyte from '@utils/currencies/digibyte'
import * as ravencoin from '@utils/currencies/ravencoin'
import * as nano from '@utils/currencies/nano'
import { getItem, removeItem, setItem } from 'utils/storage'

const defaultOptions = {
  responseTimeLimit: 8000,
  requestDebounceTime: { seconds: 20 },
}

type TWalletBalanceRequestPayload = {
  address: string
  symbol: string
  chain?: string
  contractAddress?: string
  tokenSymbol?: string
  isFullBalance?: boolean
}

export const getBalances = async (wallets: TGetBalanceWalletProps[], options: TGetBalanceOptions = {}): Promise<IGetBalances[] | null> => {

  if (wallets.length > 1) {
    setItem("enable_skeletons", "true")
  }

  try {
    const mapWallets = wallets.map(wallet => {
      const tokenSymbol = wallet.chain ? wallet.symbol : undefined
      const sharedToken = getSharedToken(wallet.symbol, wallet.chain)
      const contractAddress = wallet.contractAddress
        || sharedToken?.address
        || (wallet.chain ? getToken(wallet.symbol, wallet.chain)?.address : undefined)

      const requestPayload: TWalletBalanceRequestPayload = {
        symbol: wallet.symbol,
        address: wallet.address,
        contractAddress,
        chain: getWalletChain(wallet.symbol, wallet.chain) || wallet.chain,
        isFullBalance: wallet.isFullBalance
      }

      requestPayload.tokenSymbol = contractAddress ? tokenSymbol : undefined

      return requestPayload
    })

    const data = await fetchBalances(mapWallets)

    if (!data?.length) {
      return data
    }

    for (const wallet of data) {

      const { balanceInfo, symbol, address } = wallet

      const savedData = getLatestBalance(address, symbol)

      const precision = getBalancePrecision(symbol)
      const balanceDiff = getBalanceDiff(savedData.balance, balanceInfo.balance || 0, precision)
      const isPendingStatusChanged = !!savedData.pending !== !!balanceInfo.pending

      if (balanceDiff || isPendingStatusChanged) {
        if (balanceDiff) {
          const wallet = getSingleWallet(address, symbol)
          if (wallet?.lastBalanceCheck) {
            logEvent({
              name: GENERAL_BALANCE_CHANGE,
              properties: {
                symbol,
                dynamics: balanceDiff > 0 ? 'pos' : 'neg',
              },
            })
          }
        }
      }
      if (getItem("initial_balances_request") && wallets.length > 1) {
        removeItem("initial_balances_request")
      }
      saveBalanceData({ address, symbol, ...balanceInfo })
    }
    return data
  } catch {
    return []
  } finally {
    removeItem("enable_skeletons")
  }
}

export const getSingleBalance = async (wallet: TGetBalanceWalletProps): Promise<TBalanceData> => {
  await getBalances([wallet])
  return getLatestBalance(wallet.address, wallet.symbol)
}


export const isEthereumLike = (symbol: string, chain?: string): boolean => {
  return ethereumLike.coins.indexOf(symbol) !== -1 || typeof chain !== 'undefined'
}

const getProvider = (symbol: string): TProvider | null => {
  try {
    if (digibyte.coins.indexOf(symbol) !== -1) {
      return digibyte
    }

    if (harmony.coins.indexOf(symbol) !== -1) {
      return harmony
    }

    if (tron.coins.indexOf(symbol) !== -1) {
      return tron
    }

    if (nerve.coins.indexOf(symbol) !== -1) {
      return nerve
    }

    if (nuls.coins.indexOf(symbol) !== -1) {
      return nuls
    }

    if (neblio.coins.indexOf(symbol) !== -1) {
      return neblio
    }

    if (ripple.coins.indexOf(symbol) !== -1) {
      return ripple
    }

    if (cardano.coins.indexOf(symbol) !== -1) {
      return cardano
    }

    if (theta.coins.indexOf(symbol) !== -1) {
      return theta
    }

    if (hedera.coins.indexOf(symbol) !== -1) {
      return hedera
    }

    if (zilliqa.coins.indexOf(symbol) !== -1) {
      return zilliqa
    }

    if (verge.coins.indexOf(symbol) !== -1) {
      return verge
    }

    if (xinfin.coins.indexOf(symbol) !== -1) {
      return xinfin
    }

    if (solana.coins.indexOf(symbol) !== -1) {
      return solana
    }

    if (vechain.coins.indexOf(symbol) !== -1) {
      return vechain
    }

    if (toncoin.coins.indexOf(symbol) !== -1) {
      return toncoin
    }

    if (ravencoin.coins.indexOf(symbol) !== -1) {
      return ravencoin
    }

    if (nano.coins.indexOf(symbol) !== -1) {
      return nano
    }

    return null
  } catch {
    return null
  }
}


export const activateWallet = async (chain: string, publicKey: string, privateKey?: string): Promise<any | null> => {
  if (chain === 'xno') {
    if (!privateKey) return null
    return await nano.activateWallet(chain, publicKey, privateKey)
  }
  if (chain === 'hedera') {
    return await hedera.activateWallet(chain, publicKey)
  }
}

export const generate = async (
  symbol: string,
  chain?: string,
): Promise<TGenerateAddress | null> => {
  try {
    if (isEthereumLike(symbol, chain)) {
      return ethereumLike.generateAddress()
    }

    const provider = getProvider(symbol)

    if (provider?.generateWallet) {
      return await provider.generateWallet()
    }

    return bitcoinLike.generateWallet(symbol)
  } catch (err) {
    logErrorGenerateAddress(`${err}`, symbol, chain)
    return null
  }
}

export const importPrivateKey = async (
  symbol: string,
  privateKey: string,
  chain?: string,
): Promise<string | null> => {
  try {
    const provider = getProvider(symbol)

    if (provider?.importPrivateKey) {
      return await provider.importPrivateKey(privateKey)
    }

    if (isEthereumLike(symbol, chain)) {
      return ethereumLike.importPrivateKey(privateKey)
    } else {
      return bitcoinLike.importPrivateKey(privateKey, symbol)
    }
  } catch (err) {
    logErrorImportPrivateKey(`${err}`, symbol, chain)
    return null
  }
}

export const validateAddress = (symbol: string, address: string, tokenChain?: string): boolean => {
  try {
    const provider = getProvider(symbol)

    if (provider?.validateAddress) {
      return provider.validateAddress(address)
    }

    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return bitcoinLike.validateAddress(address, symbol)
    }
    return addressValidate(symbol, address, tokenChain)
  } catch {
    return false
  }
}

export const createTransaction = async ({
                                          from,
                                          to,
                                          amount,
                                          privateKey,
                                          symbol,
                                          tokenChain,
                                          outputs,
                                          networkFee,
                                          gas,
                                          chainId,
                                          gasPrice,
                                          nonce,
                                          contractAddress,
                                          xrpTxData,
                                          extraId,
                                        }: TCreateTransactionProps): Promise<string | null> => {
  try {
    if (vechain.coins.indexOf(symbol) !== -1) {
      return await vechain.createTransaction(from, to, amount, privateKey, symbol)
    }

    if (nerve.coins.indexOf(symbol) !== -1) {
      return await nerve.createTransaction(from, to, amount, privateKey)
    }

    if (nuls.coins.indexOf(symbol) !== -1) {
      return await nuls.createTransaction(from, to, amount, privateKey)
    }

    if (ripple.coins.indexOf(symbol) !== -1 && xrpTxData) {
      return await ripple.createTransaction(from, to, amount, privateKey, xrpTxData, extraId)
    }

    if (cardano.coins.indexOf(symbol) !== -1 && outputs) {
      return await cardano.createTransaction(outputs, from, to, amount, privateKey)
    }

    if (nano.coins.indexOf(symbol) !== -1) {
      return await nano.createTransaction(from, to, amount, privateKey)
    }

    if (isEthereumLike(symbol, tokenChain)) {
      const getContractAddress = contractAddress
        ? contractAddress
        : tokenChain
          ? getToken(symbol, tokenChain)?.address
          : undefined

      if (gas && chainId && gasPrice && typeof nonce === 'number') {
        if (tokenChain && getContractAddress) {
          return await ethereumLike.transferToken({
            value: amount,
            from,
            to,
            privateKey,
            gasPrice,
            gas,
            nonce,
            chainId,
            contractAddress: getContractAddress,
          })
        }
        return await ethereumLike.createTransaction(
          to,
          amount,
          gas,
          chainId,
          gasPrice,
          nonce,
          privateKey,
        )
      }
      return null
    }

    if (outputs?.length && networkFee) {
      if (digibyte.coins.indexOf(symbol) !== -1) {
        return digibyte.createTransaction(outputs, to, amount, networkFee, from, privateKey)
      }

      if (neblio.coins.indexOf(symbol) !== -1) {
        return neblio.createTransaction(outputs, to, amount, networkFee, from, privateKey)
      }

      if (ravencoin.coins.indexOf(symbol) !== -1 && outputs) {
        return ravencoin.createTransaction(outputs, to, amount, networkFee, from, privateKey)
      }

      return bitcoinLike.createTransaction(
        outputs,
        to,
        amount,
        networkFee,
        from,
        privateKey,
        symbol,
      )
    }

    return null
  } catch (err) {
    logErrorCreateTx(`${err}`, symbol, tokenChain)
    return null
  }
}

export const getNetworkFee = async ({
                                      symbol,
                                      addressFrom,
                                      addressTo,
                                      chain,
                                      amount,
                                      tokenChain,
                                      btcLikeParams,
                                      ethLikeParams,
                                    }: IGetFeeParams): Promise<TGetFeeData | null> => {
  if (btcLikeParams) {
    const { outputs, customFee } = btcLikeParams

    if (digibyte.coins.indexOf(symbol) !== -1) {
      return digibyte.getNetworkFee(addressFrom, outputs, amount)
    }

    if (cardano.coins.indexOf(symbol) !== -1) {
      return cardano.getNetworkFee(outputs, amount)
    }

    if (neblio.coins.indexOf(symbol) !== -1) {
      return neblio.getNetworkFee(addressFrom, outputs, amount)
    }

    if (ravencoin.coins.indexOf(symbol) !== -1) {
      return ravencoin.getNetworkFee(addressFrom, outputs, amount)
    }

    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return bitcoinLike.getNetworkFee(addressFrom, outputs, amount, customFee, symbol)
    }
  }

  if (vechain.coins.indexOf(symbol) !== -1) {
    return await vechain.getNetworkFee(addressFrom, addressTo, amount, chain)
  }

  if (xinfin.coins.indexOf(symbol) !== -1) {
    return await xinfin.getNetworkFee()
  }

  if (toncoin.coins.indexOf(symbol) !== -1 && !tokenChain) {
    const networkFee = await toncoin.getNetworkFee(addressFrom, addressTo, +amount)

    return {
      networkFee,
    }
  }

  if (isEthereumLike(symbol, tokenChain)) {
    const { contractAddress, decimals } = ethLikeParams
    const value = decimals
      ? ethereumLike.convertDecimals(amount, decimals)
      : ethereumLike.toEther(amount)

    return await getEtherNetworkFee(
      addressFrom,
      addressTo,
      value,
      tokenChain || chain,
      tokenChain ? symbol : undefined,
      contractAddress,
      decimals,
    )
  }

  if (theta.coins.indexOf(symbol) !== -1) {
    return await getThetaNetworkFee(addressFrom)
  }

  if (ripple.coins.indexOf(symbol) !== -1) {
    return await getNetworkFeeRequest('ripple')
  }

  if (harmony.coins.indexOf(symbol) !== -1) {
    return await getNetworkFeeRequest('harmony')
  }

  return null
}

export const formatUnit = (
  symbol: string,
  value: string | number,
  type: 'from' | 'to',
  chain?: string,
  unit?: string,
): string | number => {
  try {
    const provider = getProvider(symbol)

    if (provider?.formatValue) {
      return provider.formatValue(value, type)
    }

    if (chain && bitcoinLike.coins.indexOf(symbol) !== -1) {
      return type === 'from' ? bitcoinLike.fromSat(Number(value)) : bitcoinLike.toSat(Number(value))
    } else if (isEthereumLike(symbol, chain)) {
      if (unit) {
        return type === 'from'
          ? ethereumLike.fromEther(`${value}`)
          : ethereumLike.toEther(`${value}`)
      }
      return Number(value)
    }
    return 0
  } catch {
    return 0
  }
}

export const getExplorerLink = (
  address: string,
  symbol: string,
  chain: string,
  tokenChain?: string,
  contractAddress?: string,
) => {
  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getExplorerLink(address, symbol, tokenChain, contractAddress)
  }

  const provider = getProvider(symbol)

  if (provider?.getExplorerLink) {
    return provider.getExplorerLink(address)
  }

  return `https://blockchair.com/${chain}/address/${address}`
}

export const getTransactionLink = (
  hash: string,
  symbol: string,
  chain: string,
  tokenChain?: string,
): string => {
  if (isEthereumLike(symbol, tokenChain)) {
    return ethereumLike.getTransactionLink(hash, chain, tokenChain)
  }

  const provider = getProvider(symbol)

  if (provider?.getTransactionLink) {
    return provider.getTransactionLink(hash)
  }

  return `https://blockchair.com/${chain}/transaction/${hash}`
}

export const getNetworkFeeSymbol = (symbol: string, tokenChain?: string): string => {
  try {
    if (theta.coins.indexOf(symbol) !== -1) {
      return 'tfuel'
    }
    if (vechain.coins.indexOf(symbol) !== -1) {
      return 'vtho'
    }
    if (tokenChain) {
      return getCurrencyByChain(tokenChain)?.symbol || symbol
    }
    return getCurrency(symbol)?.symbol || symbol
  } catch {
    return symbol
  }
}

export const importRecoveryPhrase = async (
  symbol: string,
  recoveryPhrase: string,
): Promise<TGenerateAddress | null> => {
  try {
    const provider = getProvider(symbol)

    if (provider?.importRecoveryPhrase) {
      return provider.importRecoveryPhrase(recoveryPhrase)
    }
    return null
  } catch {
    return null
  }
}

export const getExtraIdName = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  return provider?.extraIdName || null
}

export const generateExtraId = (symbol: string): null | string => {
  const provider = getProvider(symbol)

  if (provider?.generateExtraId) {
    return provider.generateExtraId()
  }
  return null
}

export const checkWithOutputs = (symbol: string): boolean => {
  try {
    const provider = getProvider(symbol)

    return provider?.isWithOutputs || bitcoinLike.coins.indexOf(symbol) !== -1

  } catch {
    return false
  }
}

export const getFee = async (symbol: string, chain: string): Promise<TCustomFee | null> => {
  try {
    if (bitcoinLike.coins.indexOf(symbol) !== -1) {
      return await getCustomFee(chain)
    }
    return null
  } catch {
    return null
  }
}

export const getStandingFee = (symbol: string): number | null => {
  try {
    const provider = getProvider(symbol)

    if (provider?.getStandingFee) {
      return provider.getStandingFee()
    }

    if (toLower(symbol) === 'doge') {
      return 1
    }

    return null
  } catch {
    return null
  }
}

export const checkWithPhrase = (symbol: string, chain?: string): boolean => {
  if (!chain) {
    return cardano.coins.indexOf(symbol) !== -1 || toncoin.coins.indexOf(symbol) !== -1
  }
  return false
}

export const checkWithZeroFee = (symbol: string): boolean => {
  if (nerve.coins.indexOf(symbol) !== -1) {
    return true
  }
  if (nano.coins.indexOf(symbol) !== -1) {
    return true
  }

  return false
}

export const checkIsInternalTx = (symbol: string): boolean => {
  const provider = getProvider(symbol)
  return !!provider?.isInternalTx
}

export const createInternalTx = async ({
                                         symbol,
                                         addressFrom,
                                         addressTo,
                                         amount,
                                         privateKey,
                                         networkFee,
                                         outputs,
                                         extraId,
                                         tokenChain,
                                       }: TCreateInternalTxProps): Promise<string | null> => {
  try {
    const provider = getProvider(symbol)

    if (provider?.createInternalTx) {
      return await provider.createInternalTx({
        symbol,
        addressFrom,
        addressTo,
        amount,
        privateKey,
        networkFee,
        outputs,
        extraId,
      })
    }

    return null
  } catch (err) {
    logErrorCreateTx(`${err}`, symbol, tokenChain)
    return null
  }
}

export const getContractUrl = (address: string, chain: string): string => {
  if (chain === 'sol') {
    return `https://explorer.solana.com/address/${address}`
  }
  if (chain === 'eth') {
    return `https://etherscan.io/address/${address}`
  }
  return `https://bscscan.com/address/${address}`
}

export const getTokenStandard = (chain?: string): string => {
  if (chain === 'bsc') {
    return 'BEP20'
  }

  return 'ERC20'
}

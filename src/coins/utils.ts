// Utils
import { fetchBalances } from '@utils/api'
import { logEvent } from '@utils/metrics'
import {
  getBalanceDiff,
  getBalancePrecision,
  getLatestBalance,
  getSingleWallet,
  getWalletChain,
  saveBalanceData,
  TBalanceData,
} from '@utils/wallet'
import { checkIfTimePassed } from '@utils/dates'
import { getItem, removeItem, setItem } from '@utils/storage'

// Tokens
import { getSharedToken, getToken } from '@tokens/index'

// Config
import { NOT_ETH_NETWORKS, TNetwork } from '@config/networks'
import { GENERAL_BALANCE_CHANGE } from '@config/events'

// Types
import { TWalletBalanceRequestPayload } from './types'
import { IGetBalances, TGetBalanceOptions, TGetBalanceWalletProps } from '@utils/api/types'

export const getCurrencyBalance = async (address: string, tokenChain?: string): Promise<number> => {
  try {
    if (tokenChain) {
      const mapNotEthNetworks = NOT_ETH_NETWORKS.map((network: TNetwork) => network.chain)

      if (mapNotEthNetworks.indexOf(tokenChain) !== -1) {
        const request = await fetchBalances([
          {
            address,
            chain: tokenChain,
            isFullBalance: true,
          },
        ])

        if (request) {
          return request[0].balanceInfo.balance
        }
      }
    }

    return 0
  } catch {
    return 0
  }
}

export const getSingleBalance = async (wallet: TGetBalanceWalletProps): Promise<TBalanceData> => {
  const latestBalance = getLatestBalance(wallet.address, wallet.symbol)

  if (checkIfTimePassed(latestBalance.lastBalanceCheck || 0, { seconds: 30 })) {
    await getBalances([wallet])
  }

  return getLatestBalance(wallet.address, wallet.symbol)
}

export const getBalances = async (
  wallets: TGetBalanceWalletProps[],
  options: TGetBalanceOptions = {}
): Promise<IGetBalances[] | null> => {
  try {
    const mapWallets = wallets.map((wallet) => {
      const tokenSymbol = wallet.chain ? wallet.symbol : undefined
      const sharedToken = getSharedToken(wallet.symbol, wallet.chain)
      const contractAddress =
        wallet.contractAddress ||
        sharedToken?.address ||
        (wallet.chain ? getToken(wallet.symbol, wallet.chain)?.address : undefined)

      const requestPayload: TWalletBalanceRequestPayload = {
        symbol: wallet.symbol,
        address: wallet.address,
        contractAddress,
        chain: getWalletChain(wallet.symbol, wallet.chain) || wallet.chain,
        isFullBalance: wallet.isFullBalance,
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
      const isBalanceChanged = balanceDiff || isPendingStatusChanged

      if (isBalanceChanged) {
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
      if (getItem('initial_balances_request') && wallets.length > 1) {
        removeItem('initial_balances_request')
      }
      saveBalanceData({
        address,
        symbol,
        txHistoryUpdateRequired: Boolean(isBalanceChanged),
        ...balanceInfo,
      })
    }
    return data
  } catch {
    return []
  } finally {
    removeItem('enable_skeletons')
  }
}

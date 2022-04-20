// Utils
import { filterWallets, getWalletChain, getWallets, TGetWalletsOptions } from '@utils/wallet'
import { getFullTxHistory, getFullTxHistoryInfo } from '@utils/api'
import { compareFullHistory, getWalletKey, saveFullHistory } from '@utils/txs'
import { getItem, getJSON, setItem } from '@utils/storage'

// Types
import { IWallet } from '@utils/wallet'
import { TAddressTx, TFullTxInfo, TFullTxWallet, TTxAddressItem, TTxWallet } from '@utils/api/types'
import { TGetFullTxHistoryOptions } from '@utils/api'

export type THistoryUpdateOptions = {
  getWalletsOptions?: TGetWalletsOptions
  updateSingleWallet?: TTxWallet
  fetchOptions?: TGetFullTxHistoryOptions
}

const setIsLoadingFlag = (flag: boolean) => {
  (window as any).txsHistoryFetchInProgress = flag
}

export const checkIsLoadingFlag = () => {
  return (window as any).txsHistoryFetchInProgress === true
}

export const updateTxsHistory = async (
  {
    getWalletsOptions,
    updateSingleWallet,
    fetchOptions
  }: THistoryUpdateOptions = {}): Promise<boolean> => {
  try {
    if (checkIsLoadingFlag()) return false

    setIsLoadingFlag(true)
    const { applyFilters, latest } = getWalletsOptions || {}

    let payload: TTxWallet[]
    if (updateSingleWallet) {
      payload = [updateSingleWallet]
    } else {
      let wallets = getWallets({ }) || []
      if (!wallets.length) return false
      if (applyFilters) {
        wallets = wallets.filter(filterWallets)
      }
      payload = wallets.map((wallet: IWallet) => {
        const { address, chain, symbol, contractAddress } = wallet
        return {
          address,
          chain: getWalletChain(symbol, chain),
          symbol,
          tokenSymbol: chain ? symbol : undefined,
          contractAddress
        }
      })
    }

    // removeTempTxs(payload)

    const data = await getFullTxHistory(payload)

    if (!data.length) return false

    const compare = compareFullHistory(data)

    if (compare.length) {
      const mapData: TFullTxWallet[] = data.map((item: TTxAddressItem) => {
        const { chain, address, txs, symbol, tokenSymbol, contractAddress } = item

        return {
          chain,
          address,
          symbol,
          txs,
          tokenSymbol,
          contractAddress
        }
      })
      const fullTxsInfo = await getFullTxHistoryInfo(mapData, fetchOptions)
      saveFullHistory(fullTxsInfo)
      if (!updateSingleWallet) {
        setItem('lastFullHistoryUpdate', `${Date.now()}`)
        window.dispatchEvent(new CustomEvent('historyFetchComplete'))
      }
      return !!(fullTxsInfo && fullTxsInfo.length)
    }
    return false
  } catch {
    return false
  } finally {
    setIsLoadingFlag(false)
  }
}

export default updateTxsHistory


export const removeTempTxs = (wallets: TTxWallet[] | TTxWallet) => {
  const formatWallets = Array.isArray(wallets) ? wallets : [wallets]
  for (const wallet of formatWallets) {
    const { address, chain, contractAddress, symbol } = wallet
    if (['xno'].indexOf(symbol) !== -1) {
      // const getTokenSymbol = chain ? symbol : undefined
      // const getChain = getWalletChain(symbol, chain)
      const walletKey = getWalletKey(address, 'xno')
      const walletTxs = getJSON(walletKey)
      if (walletTxs?.length) {
        const nonPendingTxs = walletTxs.filter((tx: TAddressTx) => !tx.isPending)
        setItem(walletKey, JSON.stringify(nonPendingTxs))
      }
      const fullHistory = getJSON('full_history')
      if (fullHistory?.length) {
        const filteredTxs = fullHistory.filter((tx: TFullTxInfo) => {
          return !(tx.symbol === symbol && tx.isPending);
        })
        setItem('full_history', JSON.stringify(filteredTxs))
      }
    }
  }
}
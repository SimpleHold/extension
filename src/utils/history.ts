// Utils
import { getWalletChain, getWallets } from '@utils/wallet'
import { getFullTxHistory, getFullTxHistoryInfo } from '@utils/api'
import { compareFullHistory, saveFullHistory } from '@utils/txs'
import { setItem } from '@utils/storage'

// Types
import { IWallet } from '@utils/wallet'
import { TFullTxWallet, TTxAddressItem, TTxWallet } from '@utils/api/types'
import { TGetFullTxHistoryOptions } from '@utils/api'

export type THistoryUpdateOptions = {
  latest?: number
  filterFn?: (wallet: IWallet) => IWallet
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
    latest,
    filterFn,
    updateSingleWallet,
    fetchOptions
  }: THistoryUpdateOptions = {}): Promise<boolean> => {
  try {
    if (checkIsLoadingFlag()) return false;

    setIsLoadingFlag(true)

    let payload: TTxWallet[]

    if (updateSingleWallet) {
      payload = [updateSingleWallet]
    } else {
      let wallets = getWallets(filterFn ? undefined : latest) || []
      if (!wallets.length) return false
      if (filterFn) {
        wallets = wallets.filter(filterFn)
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
  } catch (err) {
    console.error(err)
    return false
  } finally {
    setIsLoadingFlag(false)
  }
}

export default updateTxsHistory

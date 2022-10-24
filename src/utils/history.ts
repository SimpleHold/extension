import dayjs from 'dayjs'
import { groupBy, pick } from 'lodash'

// Utils
import { getItem, getJSON, setItem } from '@utils/storage'
import { filterWallets, getWalletChain, getWallets, updateWalletHistoryFetchStatus } from '@utils/wallet'
import { fetchFullTxHistory } from '@utils/api'
import { toLower } from '@utils/format'

// Types
import { TAddressTx, TFullTxWallet, TTxFullInfo, TTxWallet } from '@utils/api/types'
import { IWallet, TGetWalletsOptions } from '@utils/wallet'
import { TCurrency, TFindWalletHistory } from '@drawers/HistoryFilter/types'

export type TAddressTxGroup = {
  date: string
  data: TAddressTx[]
}

export type THistoryTxGroup = {
  date: string
  data: TTxFullInfo[]
}

export type THistoryUpdateOptions = {
  getWalletsOptions?: TGetWalletsOptions
  pickSingleWallet?: TTxWallet
}

export const updateTxsHistory = async (
  {
    getWalletsOptions,
    pickSingleWallet,
  }: THistoryUpdateOptions = {}) => {
  const { applyFilters } = getWalletsOptions || {}

  try {
    if (sessionStorage.getItem('history_fetch_pending')) {
      return
    }

    if (!pickSingleWallet) {
      sessionStorage.setItem('history_fetch_pending', 'true')
    }

    let payload: TTxWallet[]
    if (pickSingleWallet) {
      payload = [pickSingleWallet]
    } else {
      let wallets = getWallets({}) || []
      if (!wallets.length) return false
      if (applyFilters) {
        wallets = wallets.filter(filterWallets)
      }
      payload = wallets
        .map((wallet: IWallet) => {
          const { address, chain, symbol, contractAddress } = wallet
          return {
            address,
            chain: chain || getWalletChain(symbol, chain),
            symbol,
            tokenSymbol: chain ? symbol : undefined,
            contractAddress,
          }
        })
        .filter(wallet => wallet.address)
    }
    const data = await fetchFullTxHistory(payload)
    if (!data.length) return

    const compare = compareFullHistory(data)

    if (compare.length) {
      const mapData = compare.flatMap(data => data.txs)
      saveFullHistory(mapData)
    }
  } catch {

  } finally {
    sessionStorage.removeItem('history_fetch_pending')
  }
}

export const group = (txs: TAddressTx[]): TAddressTxGroup[] => {
  if (!txs.length) {
    return []
  }

  const data: TAddressTxGroup[] = []
  const groupByMonth = (item: TAddressTx) => dayjs(item.date, 'YYYY-MM-DD').format('YYYY-MM-DD')
  const result = groupBy(txs, groupByMonth)

  for (const i in result) {
    data.push({
      date: i,
      data: result[i],
    })
  }

  return data
}

export const groupHistory = (txs: TTxFullInfo[]): THistoryTxGroup[] => {
  if (!txs.length) {
    return []
  }

  const data: THistoryTxGroup[] = []

  const sortTxs = txs.sort(
    (a: TTxFullInfo, b: TTxFullInfo) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const result = groupBy(sortTxs, (item: TTxFullInfo) =>
    dayjs(item.date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
  )

  for (const i in result) {
    data.push({
      date: i,
      data: result[i],
    })
  }

  return data
}

export const getStats = (): string | null => {
  return getItem('txs_stats')
}

export const updateStats = (): void => {
  const getStats = getItem('txs_stats')

  let newAmount = 0

  if (getStats) {
    const { amount } = JSON.parse(getStats)
    newAmount = amount + 1
  }

  setItem(
    'txs_stats',
    JSON.stringify({
      amount: newAmount,
      lastUpdate: new Date().getTime(),
    }),
  )
}

export const compareFullHistory = (items: TFullTxWallet[]): TFullTxWallet[] => {
  const getHistory = getJSON('full_history')

  if (getHistory?.length) {
    const data: TFullTxWallet[] = []

    for (const item of items) {
      const { address, chain, symbol, tokenSymbol, contractAddress } = item

      const findTxs = item.txs.filter((i) =>
        getHistory.find(
          (ii: TTxFullInfo) => {
            const hashMatch = ii.hash === i.hash
            const symbolMatch = ii.symbol === symbol
            const chainMatch = ii.chain === chain
            const isPending = ii.isPending
            const fullMatch = hashMatch && symbolMatch && chainMatch && isPending
            return !fullMatch
          },
        ),
      )
      if (findTxs.length) {
        data.push({
          address,
          chain,
          symbol,
          txs: findTxs,
          tokenSymbol,
          contractAddress,
        })
      }
    }

    return data
  }

  return items
}

export const saveFullHistory = (txs: TTxFullInfo[]): void => {
  const getHistory = getJSON('full_history')
  if (getHistory?.length) {
    const getNewTxs = txs.filter((newTx: TTxFullInfo) => {
      return !getHistory.find((tx: TTxFullInfo) => {
        const hashMatch = toLower(tx.hash) === toLower(newTx.hash)
        const amountMatch = tx.amount === newTx.amount
        const addressMatch = tx.address === newTx.address
        const symbolMatch = tx.symbol === newTx.symbol
        const chainMatch = tx.chain === newTx.chain
        return hashMatch && amountMatch && addressMatch && symbolMatch && chainMatch
      })
    })

    const getUpdatedPendingTxs = getHistory.map((tx: TTxFullInfo) => {
      const match = txs.find((newTx: TTxFullInfo) => {
        const hashMatch = toLower(newTx.hash) === toLower(tx.hash)
        const addressMatch = toLower(newTx.address) === toLower(tx.address)
        const symbolMatch = tx.symbol === newTx.symbol
        const chainMatch = tx.chain === newTx.chain
        const pendingStatusUpdated = tx.isPending !== newTx.isPending
        return hashMatch && addressMatch && symbolMatch && chainMatch && pendingStatusUpdated
      })
      return match ? { ...tx, isPending: false } : tx
    })

    for (const tx of getNewTxs) {
      updateWalletHistoryFetchStatus(tx.address, tx.symbol, false)
    }
    setItem('full_history', JSON.stringify([...getUpdatedPendingTxs, ...getNewTxs]))
  } else {
    setItem('full_history', JSON.stringify(txs))
  }
}

const filterHistoryByStatus = (item: TTxFullInfo, status: string): boolean => {
  if (status === 'sent') {
    return item.amount < 0
  } else if (status === 'received') {
    return item.amount > 0
  }
  return item.isPending
}

const filterHistoryByCurrencies = (
  currencies: string | null,
  addresses: string | null,
  item: TTxFullInfo,
) => {
  if (!currencies && !addresses) {
    return item
  }

  if (currencies?.length && !addresses) {
    return JSON.parse(currencies).find(
      (currency: TCurrency) => toLower(currency.symbol) === toLower(item.symbol),
    )
  }

  if (addresses?.length) {
    return JSON.parse(addresses).find(
      (wallet: IWallet) =>
        toLower(wallet.symbol) === toLower(item.symbol) &&
        toLower(wallet.address) === toLower(item.address),
    )
  }
}

const filterFullHistory = (item: TTxFullInfo): TTxFullInfo | boolean => {
  const getCurrencies = getItem('txHistoryCurrencies')
  const getAddresses = getItem('txHistoryAddresses')
  const getStatus = getItem('txHistoryStatus')

  if (!getCurrencies && !getAddresses && !getStatus) {
    return item
  }

  const filterByStatus = getStatus ? filterHistoryByStatus(item, getStatus) : item
  const filterByCurrencies = filterHistoryByCurrencies(getCurrencies, getAddresses, item)

  return filterByStatus && filterByCurrencies
}

export const getFullHistory = (): TTxFullInfo[] => {
  const getHistory = getJSON('full_history')

  if (getHistory?.length) {
    return getHistory.filter(filterFullHistory)
  }

  return []
}

export const findWalletTxHistory = ({ symbol, chain, address }: TFindWalletHistory): TAddressTx[] => {
  const fullHistory: TTxFullInfo[] | undefined = getJSON('full_history')
  if (!fullHistory) {
    return []
  }
  const filteredHistory = fullHistory.filter((tx) => {
    return (
      tx.symbol === symbol
      && tx.address === address
      && tx.chain === chain
    )
  })

  const mapHistory: TAddressTx[] = filteredHistory.map(tx => {
    return pick(tx, ['type', 'hash', 'amount', 'date', 'isPending', 'estimated'])
  })

  return mapHistory
}


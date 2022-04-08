import dayjs from 'dayjs'
import { groupBy } from 'lodash'

// Utils
import { getItem, getJSON, setItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Types
import { TAddressTx, TFullTxInfo, TTxAddressItem } from '@utils/api/types'
import { IWallet } from '@utils/wallet'
import { TCurrency } from '@drawers/HistoryFilter/types'

export type TAddressTxGroup = {
  date: string
  data: TAddressTx[]
}

export type THistoryTxGroup = {
  date: string
  data: TFullTxInfo[]
}


export const getWalletKey = (
  address: string,
  chain: string,
  tokenSymbol?: string,
  contractAddress?: string
) => {
  let key = `${address}_${chain}`

  if (tokenSymbol) {
    key += `_${tokenSymbol}`
  }

  if (contractAddress) {
    key += `_${contractAddress}`
  }

  return key
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
      data: result[i]
    })
  }

  return data
}

export const groupHistory = (txs: TFullTxInfo[]): THistoryTxGroup[] => {
  if (!txs.length) {
    return []
  }

  const data: THistoryTxGroup[] = []

  const sortTxs = txs.sort(
    (a: TFullTxInfo, b: TFullTxInfo) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const result = groupBy(sortTxs, (item: TFullTxInfo) =>
    dayjs(item.date, 'YYYY-MM-DD').format('YYYY-MM-DD')
  )

  for (const i in result) {
    data.push({
      date: i,
      data: result[i]
    })
  }

  return data
}

export const compare = (
  address: string,
  chain: string,
  txs: string[],
  tokenSymbol?: string,
  contractAddress?: string
): string[] => {
  const getTxs = getJSON(getWalletKey(address, chain, tokenSymbol, contractAddress))
  if (getTxs?.length) {
    return txs.filter(
      (hash: string) => {
        const txExists = getTxs.find((tx: TAddressTx) => (toLower(tx.hash) === toLower(hash)) && !tx.isPending)
        return !txExists
      }
    )
  }

  return txs
}

export const getExist = (
  address: string,
  chain: string,
  tokenSymbol?: string,
  contractAddress?: string
): TAddressTx[] => {
  try {
    const getTxs = getJSON(getWalletKey(address, chain, tokenSymbol, contractAddress))

    if (getTxs?.length) {
      return getTxs
    }
    return []
  } catch {
    return []
  }
}

export const save = (
  address: string,
  chain: string,
  txs: TAddressTx[],
  tokenSymbol?: string,
  contractAddress?: string
) => {
  const walletKey = getWalletKey(address, chain, tokenSymbol, contractAddress)

  const findWalletStorage = getItem(walletKey)
  if (findWalletStorage) {
    const getTxs = getJSON(walletKey)
    if (getTxs) {
      const getNewTxs = txs.filter((newTx: TAddressTx) => {
        return !getTxs.find((tx: TAddressTx) => toLower(tx.hash) === toLower(newTx.hash))
      })
      let pendingUpdated = false
      const getUpdatedPendingTxs = getTxs.map((tx: TAddressTx) => {
        const match = txs.find((newTx: TAddressTx) => {
          const hashMatch = toLower(newTx.hash) === toLower(tx.hash)
          const pendingStatusUpdated = tx.isPending && !newTx.isPending
          const isUpdated = hashMatch && pendingStatusUpdated
          if (isUpdated) {
            pendingUpdated = true
          }
          return isUpdated
        })
        return match ? { ...tx, isPending: false } : tx
      })
      if (getNewTxs.length || pendingUpdated) {
        setItem(walletKey, JSON.stringify([...getUpdatedPendingTxs, ...getNewTxs]))
      }
    } else {
      setItem(walletKey, JSON.stringify(txs))
    }
  } else {
    setItem(walletKey, JSON.stringify(txs))
  }
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
      lastUpdate: new Date().getTime()
    })
  )
}

export const isShowSatismeter = (prevValue: number, value: number): boolean => {
  const getStats = getJSON('txs_stats')

  if (getStats) {
    const { lastUpdate } = getStats
    const monthDiff = dayjs().diff(lastUpdate, 'month')

    return (prevValue < 1 && value > 0) || monthDiff >= 3
  }

  return false
}

export const compareFullHistory = (items: TTxAddressItem[]): TTxAddressItem[] => {
  const getHistory = getJSON('full_history')

  if (getHistory?.length) {
    const data: TTxAddressItem[] = []

    for (const item of items) {
      const { address, chain, symbol, tokenSymbol, contractAddress } = item

      const findTxs = item.txs.filter((i) =>
        getHistory.find(
          (ii: TFullTxInfo) => {
            const hashMatch = ii.hash === i
            const symbolMatch = ii.symbol === symbol
            const chainMatch = ii.chain === chain
            const isPending = ii.isPending
            const fullMatch = hashMatch && symbolMatch && chainMatch && isPending
            return !fullMatch
          }
        )
      )
      if (findTxs.length) {
        data.push({
          address,
          chain,
          symbol,
          txs: findTxs,
          tokenSymbol,
          contractAddress
        })
      }
    }

    return data
  }

  return items
}

export const saveFullHistory = (txs: TFullTxInfo[]): void => {
  const getHistory = getJSON('full_history')
  if (getHistory?.length) {
    const getNewTxs = txs.filter((newTx: TFullTxInfo) => {
      return !getHistory.find((tx: TFullTxInfo) => {
        const hashMatch = toLower(tx.hash) === toLower(newTx.hash)
        const amountMatch = tx.amount === newTx.amount
        const addressMatch = tx.address === newTx.address
        return hashMatch && amountMatch && addressMatch
      })
    })
    // let hasPendingUpdates = false
    const formatHistory = getHistory.filter((tx: TFullTxInfo) => {
      if (toLower(tx.symbol) === "xno") {
        return !tx.isPending
      }
      return tx
    })
    const getUpdatedPendingTxs = formatHistory.map((tx: TFullTxInfo) => {
      const match = txs.find((newTx: TFullTxInfo) => {
        const hashMatch = toLower(newTx.hash) === toLower(tx.hash)
        const addressMatch = toLower(newTx.address) === toLower(tx.address)
        const pendingStatusUpdated = tx.isPending !== newTx.isPending
        // if (pendingStatusUpdated) {
        //   hasPendingUpdates = true
        // }
        return hashMatch && addressMatch && pendingStatusUpdated
      })
      return match ? { ...tx, isPending: false } : tx
    })
    setItem('full_history', JSON.stringify([...getUpdatedPendingTxs, ...getNewTxs]))
  } else {
    setItem('full_history', JSON.stringify(txs))
  }
}

const filterHistoryByStatus = (item: TFullTxInfo, status: string): boolean => {
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
  item: TFullTxInfo
) => {
  if (!currencies && !addresses) {
    return item
  }

  if (currencies?.length && !addresses) {
    return JSON.parse(currencies).find(
      (currency: TCurrency) => toLower(currency.symbol) === toLower(item.symbol)
    )
  }

  if (addresses?.length) {
    return JSON.parse(addresses).find(
      (wallet: IWallet) =>
        toLower(wallet.symbol) === toLower(item.symbol) &&
        toLower(wallet.address) === toLower(item.address)
    )
  }
}

const filterFullHistory = (item: TFullTxInfo): TFullTxInfo | boolean => {
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

export const getFullHistory = (): TFullTxInfo[] => {
  const getHistory = getJSON('full_history')

  if (getHistory?.length) {
    return getHistory.filter(filterFullHistory)
  }

  return []
}

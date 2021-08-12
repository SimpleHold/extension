import dayjs from 'dayjs'
import { groupBy } from 'lodash'

// Utils
import { getItem, getJSON, setItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Types
import { TAddressTx } from '@utils/api/types'

export type TAddressTxGroup = {
  date: string
  data: TAddressTx[]
}

const getWalletKey = (
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
      data: result[i],
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
  const walletKey = getWalletKey(address, chain, tokenSymbol, contractAddress)
  const getTxs = getJSON(walletKey)

  if (getTxs?.length) {
    return txs.filter((hash: string) => {
      return !getTxs.find((tx: TAddressTx) => toLower(tx.hash) === toLower(hash))
    })
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
    const walletKey = getWalletKey(address, chain, tokenSymbol, contractAddress)
    const getTxs = getJSON(walletKey)

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
  const nonPendintTxs = txs.filter((tx: TAddressTx) => !tx.isPending)
  const walletKey = getWalletKey(address, chain, tokenSymbol, contractAddress)

  const findWalletStorage = getItem(walletKey)

  if (findWalletStorage) {
    const getTxs = getJSON(findWalletStorage)

    if (getTxs) {
      const getNewTxs = nonPendintTxs.filter((newTx: TAddressTx) => {
        return !getTxs.find((tx: TAddressTx) => toLower(tx.hash) === toLower(newTx.hash))
      })

      if (getNewTxs.length) {
        setItem(walletKey, JSON.stringify([...getTxs, ...getNewTxs]))
      }
    }
  } else {
    setItem(walletKey, JSON.stringify(nonPendintTxs))
  }
}

export const getStats = (): string | null => {
  return getItem('txs_stats')
}

export const updateStats = (): void => {
  const getStats = getItem('txs_stats')

  let prevAmount = 0

  if (getStats) {
    const { amount } = JSON.parse(getStats)
    prevAmount = amount
  }
  setItem(
    'txs_stats',
    JSON.stringify({
      amount: prevAmount + 1,
      lastUpdate: new Date().getTime(),
    })
  )
}

export const isShowSatismeter = (newAmount: number): boolean => {
  const getStats = getJSON('txs_stats')

  if (getStats) {
    const { amount, lastUpdate } = getStats

    return (amount < 2 && newAmount >= 2) || dayjs().diff(lastUpdate, 'month') >= 3
  }

  return false
}

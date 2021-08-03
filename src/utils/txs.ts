import dayjs from 'dayjs'
import { groupBy } from 'lodash'

// Utils
import { getItem, getJSON } from '@utils/storage'

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

export const getExist = (
  address: string,
  chain: string,
  tokenSymbol?: string,
  contractAddress?: string
): TAddressTx[] => {
  try {
    const walletKey = getWalletKey(address, chain, tokenSymbol, contractAddress)

    const findWalletStorage = getItem(walletKey)

    if (findWalletStorage) {
      const getTxs = getJSON(findWalletStorage)

      if (getTxs) {
        return getTxs
      }
    }
    return []
  } catch {
    return []
  }
}

export const save = (
  address: string,
  chain: string,
  txs: TAddressTxGroup[],
  tokenSymbol?: string,
  contractAddress?: string
) => {}

const deletedDataOnLogout: string[] = [
  'wallets',
  'backup',
  'activeSortKey',
  'activeSortType',
  'zeroBalancesFilter',
  'hiddenWalletsFilter',
  'selectedCurrenciesFilter',
  'txHistoryStatus',
  'txHistoryCurrencies',
  'txHistoryAddresses',
  'full_history',
]

export const getItem = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const setItem = (key: string, value: string): void => {
  return localStorage.setItem(key, value)
}

export const removeItem = (key: string): void => {
  return localStorage.removeItem(key)
}

export const removeMany = (keys: string[]): void => {
  for (const key of keys) {
    removeItem(key)
  }
}

export const clear = (): void => {
  localStorage.clear()
}

export const getJSON = (key: string): any | null => {
  try {
    const item = getItem(key)

    if (item) {
      return JSON.parse(item)
    }
    return null
  } catch {
    return null
  }
}

export const checkOneOfExist = (keys: string[]): boolean => {
  try {
    let isExist = false

    for (const key of keys) {
      if (getItem(key)) {
        isExist = true
      }
    }

    return isExist
  } catch {
    return false
  }
}

export const removeCache = (): void => {
  removeMany(deletedDataOnLogout)
}

export const addNFTImage = (
  contractAddress: string,
  chain: string,
  tokenId: number,
  image: string
) => {
  const getImagesList = getJSON('nft')

  const newImage = {
    contractAddress,
    chain,
    image,
    tokenId,
  }

  if (getImagesList) {
    setItem('nft', JSON.stringify([...getImagesList, newImage]))
  } else {
    setItem('nft', JSON.stringify([newImage]))
  }
}

type TNFtItem = {
  contractAddress: string
  chain: string
  tokenId: number
  image: string
}

export const getNFTImage = (
  contractAddress: string,
  chain: string,
  tokenId: number
): string | null => {
  const getImagesList = getJSON('nft')

  if (!getImagesList) {
    return null
  }

  const findImage = getImagesList.find(
    (item: TNFtItem) =>
      item.chain === chain && item.contractAddress === contractAddress && item.tokenId === tokenId
  )

  return findImage?.image || null
}

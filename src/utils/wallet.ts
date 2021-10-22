import { v4 } from 'uuid'

// Utils
import { validateWallet } from '@utils/validate'
import { toLower } from '@utils/format'
import { encrypt } from '@utils/crypto'
import { getItem, setItem } from '@utils/storage'

// Config
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Types
import { TBackup } from '@utils/backup'

export type THardware = {
  path: string
  label: string
  type: 'trezor' | 'ledger'
  deviceId: string
}

export interface IWallet {
  symbol: string
  balance?: number
  balance_btc?: number
  address: string
  uuid: string
  privateKey?: string
  chain?: string
  name?: string
  contractAddress?: string
  decimals?: number
  createdAt?: Date
  isHidden?: boolean
  mnemonic?: string
  walletName?: string
  hardware?: THardware
  isNotActivated?: boolean
}

type TSelectedWalletFilter = {
  symbol: string
  chain?: string
}

type THardwareCurrency = {
  symbol: string
  address: string
  path: string
}

type THardwareFirstAddress = {
  symbol: string
  address: string
}

const sortByBalance = (a: IWallet, b: IWallet, isAscending: boolean) => {
  return isAscending
    ? Number(a.balance_btc || 0) - Number(b.balance_btc || 0)
    : Number(b.balance_btc || 0) - Number(a.balance_btc || 0)
}

const sortByDate = (a: IWallet, b: IWallet, isAscending: boolean) => {
  if (a.createdAt && b.createdAt) {
    return isAscending
      ? new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
      : new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
  }
  return -1
}

const sortByName = (a: IWallet, b: IWallet, isAscending: boolean): number => {
  const currencyA = a.chain ? getToken(a.symbol, a.chain) : getCurrency(a.symbol)
  const currencyB = b.chain ? getToken(b.symbol, b.chain) : getCurrency(b.symbol)

  const nameA = a.name || currencyA?.name
  const nameB = b.name || currencyB?.name

  if (nameA && nameB) {
    return isAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  }
  return -1
}

export const sortWallets = (a: IWallet, b: IWallet) => {
  const getSortKey = getItem('activeSortKey')
  const getSortType = getItem('activeSortType')

  if (getSortKey && getSortType) {
    const isAscending = getSortType === 'asc'

    if (getSortKey === 'balances') {
      return sortByBalance(a, b, isAscending)
    } else if (getSortKey === 'date') {
      return sortByDate(a, b, isAscending)
    } else if (getSortKey === 'alphabet') {
      return sortByName(a, b, isAscending)
    }
  }
  // @ts-ignore
  return a - b
}

export const filterWallets = (wallet: IWallet) => {
  const zeroBalances = getItem('zeroBalancesFilter')
  const hiddenWallets = getItem('hiddenWalletsFilter')
  const selectedCurrencies = getItem('selectedCurrenciesFilter')

  if (!zeroBalances && !hiddenWallets && !selectedCurrencies) {
    return wallet.isHidden !== true
  }

  const filterByZeroBalance =
    zeroBalances === 'false' ? typeof wallet.balance !== 'undefined' && wallet.balance > 0 : wallet
  const filterByHidden =
    hiddenWallets === 'false' && hiddenWallets !== null ? wallet.isHidden !== true : wallet
  const filterByCurrency = selectedCurrencies
    ? JSON.parse(selectedCurrencies).some(
        (i: TSelectedWalletFilter) =>
          toLower(i.symbol) === toLower(wallet.symbol) && toLower(i.chain) === toLower(wallet.chain)
      )
    : wallet

  return filterByZeroBalance && filterByHidden && filterByCurrency
}

export const getWallets = (): IWallet[] | null => {
  try {
    const walletsList = getItem('wallets')

    if (walletsList) {
      const parseWallets = JSON.parse(walletsList)
      return parseWallets
    }
    return null
  } catch {
    return null
  }
}

export const updateBalance = (
  address: string,
  symbol: string,
  balance: number,
  balance_btc: number
): void => {
  const wallets = getWallets()
  const findWallet = wallets?.find(
    (wallet: IWallet) =>
      toLower(wallet.address) === toLower(address) && toLower(wallet.symbol) === toLower(symbol)
  )

  if (findWallet) {
    findWallet.balance = balance
    findWallet.balance_btc = balance_btc
    setItem('wallets', JSON.stringify(wallets))
  }
}

export const getLatestBalance = (address: string, chain?: string): number | null => {
  const wallets = getWallets()

  if (wallets) {
    const findWallet = wallets.find(
      (wallet: IWallet) =>
        toLower(wallet.address) === toLower(address) && toLower(wallet.chain) === toLower(chain)
    )

    if (findWallet) {
      return findWallet.balance || null
    }
  }

  return null
}

export const checkExistWallet = (address: string, symbol: string, chain?: string): boolean => {
  const wallets = getWallets()

  if (wallets?.length) {
    const checkExistWallet =
      wallets.find(
        (wallet: IWallet) =>
          toLower(wallet.address) === toLower(address) &&
          toLower(wallet.symbol) === toLower(symbol) &&
          toLower(wallet.chain) === toLower(chain)
      ) !== undefined

    if (chain) {
      const getCurrency = getCurrencyByChain(chain)

      if (getCurrency) {
        const checkExistChainWallet =
          wallets.find(
            (wallet: IWallet) =>
              toLower(wallet.address) === toLower(address) &&
              toLower(wallet.symbol) === toLower(getCurrency.symbol)
          ) !== undefined

        return checkExistChainWallet || checkExistWallet
      }
    }
    return checkExistWallet
  }
  return false
}

export const addNew = (
  address: string,
  privateKey: string,
  decryptBackup: string,
  password: string,
  currencies: string[],
  includeChain?: boolean,
  chain?: string,
  tokenName?: string,
  contractAddress?: string,
  decimals?: number,
  mnemonic?: string | null,
  isNotActivated?: boolean
): string | null => {
  const parseBackup = JSON.parse(decryptBackup)

  for (const [index, currency] of currencies.entries()) {
    const getTokenName = index == 0 ? tokenName : undefined
    const getContractAddress = index === 0 ? contractAddress : undefined
    const getDecimals = index === 0 ? decimals : undefined

    const getChain = includeChain
      ? index !== 1
        ? chain
        : undefined
      : index === 0
      ? chain
      : undefined

    const walletsList = getItem('wallets')
    const validateWallets = validateWallet(walletsList)

    if (validateWallets && walletsList) {
      const parseWallets = JSON.parse(walletsList)

      const data = {
        symbol: toLower(currency),
        address,
        uuid: v4(),
        chain: getChain,
        name: getTokenName,
        contractAddress: getContractAddress,
        decimals: getDecimals,
        createdAt: new Date(),
        isNotActivated,
      }

      parseWallets.push(data)
      parseBackup.wallets.push({ ...data, ...{ privateKey, mnemonic } })

      setItem('backup', encrypt(JSON.stringify(parseBackup), password))
      setItem('wallets', JSON.stringify(parseWallets))
    }
  }

  return getItem('wallets')
}

export const toggleVisibleWallet = (address: string, symbol: string, isHidden: boolean): void => {
  const wallets = getWallets()

  if (wallets) {
    const findWallet = wallets.find(
      (wallet: IWallet) =>
        toLower(wallet.address) === toLower(address) && toLower(wallet.symbol) === toLower(symbol)
    )

    if (findWallet) {
      findWallet.isHidden = isHidden
      setItem('wallets', JSON.stringify(wallets))
    }
  }
}

export const addHardwareWallet = (
  type: 'trezor' | 'ledger',
  currencies: THardwareCurrency[],
  hardwareLabel: string,
  deviceId: string,
  backup: string,
  password: string,
  firstAddresses?: THardwareFirstAddress[]
): string | null => {
  try {
    const parseBackup = JSON.parse(backup)

    const getDeviceId = (symbol: string): string => {
      if (type === 'trezor') {
        return deviceId
      }

      if (firstAddresses?.length) {
        const findFirstAddress = firstAddresses.find(
          (address: THardwareFirstAddress) => toLower(address.symbol) === toLower(symbol)
        )

        if (findFirstAddress) {
          return findFirstAddress.address
        }
      }

      return deviceId
    }

    for (const currency of currencies) {
      const { symbol, address, path } = currency

      const walletsList = getItem('wallets')

      if (walletsList) {
        const parseWallets = JSON.parse(walletsList)

        const data = {
          symbol: toLower(symbol),
          address,
          uuid: v4(),
          createdAt: new Date(),
          hardware: {
            path,
            label: hardwareLabel,
            type,
            deviceId: getDeviceId(symbol),
          },
        }

        parseWallets.push(data)
        parseBackup.wallets.push(data)

        const getHardwareWalelts = parseWallets.filter(
          (wallet: IWallet) =>
            wallet.hardware?.type === type &&
            toLower(wallet?.hardware?.deviceId) === toLower(deviceId)
        )
        const getBackupHardwareWalelts: IWallet[] = parseBackup.wallets.filter(
          (wallet: IWallet) =>
            wallet.hardware?.type === type &&
            toLower(wallet?.hardware?.deviceId) === toLower(deviceId)
        )

        if (getHardwareWalelts.length) {
          getHardwareWalelts.forEach((wallet: IWallet) => {
            if (wallet?.hardware) {
              wallet.hardware.label = hardwareLabel
            }
          })
        }

        if (getBackupHardwareWalelts.length) {
          getBackupHardwareWalelts.forEach((wallet: IWallet) => {
            if (wallet?.hardware) {
              wallet.hardware.label = hardwareLabel
            }
          })
        }

        setItem('backup', encrypt(JSON.stringify(parseBackup), password))
        setItem('wallets', JSON.stringify(parseWallets))
      }
    }

    return getItem('wallets')
  } catch {
    return null
  }
}

export const getWalletName = (
  wallets: IWallet[],
  symbol: string,
  uuid: string,
  hardware?: THardware,
  chain?: string,
  name?: string
): string => {
  if (hardware) {
    return hardware.label
  }

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  const getWalletPosition = wallets
    .filter((wallet: IWallet) => toLower(wallet.symbol) === toLower(symbol))
    .findIndex((wallet) => toLower(wallet.uuid) === toLower(uuid))

  if (currency) {
    return `${currency.name}-${getWalletPosition + 1}`
  } else if (name) {
    return `${name}-${getWalletPosition + 1}`
  }

  return symbol
}

export const renameWallet = (uuid: string, name: string) => {
  const wallets = getWallets()

  if (wallets) {
    const findWalletIndex = wallets.findIndex(
      (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
    )

    if (findWalletIndex !== -1) {
      wallets[findWalletIndex].walletName = name
      setItem('wallets', JSON.stringify(wallets))
    }
  }
}

export const getWalletChain = (symbol: string, chain?: string): string => {
  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  if (currency) {
    return currency?.chain
  }

  return ''
}

export const getUnique = (wallets: IWallet[]): IWallet[] => {
  return wallets.filter(
    (v, i, a) =>
      a.findIndex((wallet: IWallet) => wallet.symbol === v.symbol && wallet.chain === v.chain) === i
  )
}

export const sortAlphabetically = (a: IWallet, b: IWallet): number => {
  return a.symbol.localeCompare(b.symbol)
}

export const activateAddress = (
  uuid: string,
  address: string,
  backup: string,
  password: string
): void => {
  const wallets = getWallets()

  if (wallets) {
    const findWalletIndex = wallets.findIndex(
      (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
    )

    if (findWalletIndex !== -1) {
      wallets[findWalletIndex].address = address
      delete wallets[findWalletIndex].isNotActivated
      setItem('wallets', JSON.stringify(wallets))
    }
  }

  const parseBackup: TBackup | null = JSON.parse(backup)

  if (parseBackup) {
    const findWalletIndex = parseBackup.wallets.findIndex(
      (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
    )

    if (findWalletIndex !== -1) {
      parseBackup.wallets[findWalletIndex].address = address
      delete parseBackup.wallets[findWalletIndex].isNotActivated

      setItem('backup', encrypt(JSON.stringify(parseBackup), password))
    }
  }
}

export const parseWalletsData = (wallets: string) => {
  const addresses: IWallet[] = JSON.parse(wallets)
  const addressesHid = addresses.filter(a => a.isHidden)
  const addressesEmpty = addresses.filter(a => !a.balance && !a.balance_btc)
  const parseSymbols = (wallets: IWallet[]): string => wallets.map(a => a.symbol).join()
  return {
    addresses: parseSymbols(addresses),
    addressesCount: `${addresses.length}`,
    addressesHid: parseSymbols(addressesHid),
    addressesHidCount: `${addressesHid.length}`,
    addressesEmpty: parseSymbols(addressesEmpty),
    addressesEmptyCount: `${addressesEmpty.length}`,
  }
}
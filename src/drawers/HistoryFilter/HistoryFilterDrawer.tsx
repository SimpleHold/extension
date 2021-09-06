import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'
import GroupDropdown from '@components/GroupDropdown'
import DropdownCurrency from '@components/DropdownCurrency'
import Wallet from './components/Wallet'
import CurrencyLogo from '@components/CurrencyLogo'
import SelectedWallets from './components/SelectedWallets'

// Utils
import { getWallets, IWallet, getWalletName, getUnique, sortAlphabetically } from '@utils/wallet'
import { toLower } from '@utils/format'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Types
import { Props, TStatuses, TStatusItem, TCurrency } from './types'

// Styles
import Styles from './styles'

const statuses: TStatusItem[] = [
  {
    title: 'Sended',
    key: 'sended',
  },
  {
    title: 'Received',
    key: 'received',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
]

const HistoryFilterDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [status, setStatus] = React.useState<TStatuses | null>(null)
  const [currencies, setCurrencies] = React.useState<TCurrency[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<TCurrency[]>([])
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [selectedWallets, setSelectedWallets] = React.useState<IWallet[]>([])
  const [isWalletsVisible, setWalletsVisible] = React.useState<boolean>(false)

  React.useEffect(() => {
    onGetCurrencies()
    onGetWallets()
  }, [])

  const onGetWallets = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList)
    }
  }

  const onGetCurrencies = (): void => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const uniqueWallets = getUnique(walletsList)

      const mapWallets = uniqueWallets.sort(sortAlphabetically).map((wallet: IWallet) => {
        const { chain, symbol, name } = wallet

        const getWalletInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

        return {
          symbol: getWalletInfo?.symbol || symbol,
          name: name || getWalletInfo?.name || '',
          chain,
        }
      })

      setCurrencies(mapWallets)
    }
  }

  const onApply = (): void => {
    onClose()
  }

  const selectStatus = (status: TStatuses) => (): void => {
    setStatus(status)
  }

  const onToggleCurrency = (
    symbol: string,
    name: string,
    isActive: boolean,
    chain?: string
  ) => (): void => {
    let newCurrenciesList = [...selectedCurrencies]

    if (isActive) {
      newCurrenciesList = newCurrenciesList.filter(
        (currency: TCurrency) =>
          toLower(currency.symbol) !== toLower(symbol) || toLower(currency.chain) !== toLower(chain)
      )
    } else {
      newCurrenciesList.push({
        symbol,
        chain,
        name,
      })
    }

    setSelectedCurrencies(newCurrenciesList)
  }

  const renderCurrencies = (
    <>
      {currencies.map((currency: TCurrency) => {
        const { symbol, name, chain } = currency
        const isActive =
          selectedCurrencies.find(
            (currency: TCurrency) =>
              toLower(currency.symbol) === toLower(symbol) &&
              toLower(currency.chain) === toLower(chain)
          ) !== undefined

        return (
          <DropdownCurrency
            key={`${symbol}/${name}/${chain}`}
            symbol={symbol}
            chain={chain}
            name={name}
            isActive={isActive}
            onToggle={onToggleCurrency(symbol, name, isActive, chain)}
          />
        )
      })}
    </>
  )

  const getNameWallet = (wallet: IWallet): string => {
    if (wallet.walletName) {
      return wallet.walletName
    }

    const walletsList = getWallets()

    if (walletsList) {
      const { symbol, uuid, hardware, chain, name } = wallet

      return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
    }

    return ''
  }

  const onToggleAddress = (isActive: boolean, wallet: IWallet) => (): void => {
    if (isActive) {
      const removeExist = selectedWallets.filter((item: IWallet) => item.uuid !== wallet.uuid)
      setSelectedWallets(removeExist)
    } else {
      setSelectedWallets([...selectedWallets, wallet])
    }
  }

  const filterWallets = (wallet: IWallet): boolean | IWallet => {
    if (selectedCurrencies.length) {
      return (
        selectedCurrencies.find(
          (currency: TCurrency) =>
            toLower(currency.symbol) === toLower(wallet.symbol) &&
            toLower(currency.chain) === toLower(wallet.chain)
        ) !== undefined
      )
    }

    return wallet
  }

  const renderAddresses = (
    <>
      {wallets.filter(filterWallets).map((wallet: IWallet) => {
        const { symbol, address, chain, name, uuid } = wallet
        const walletName = getNameWallet(wallet)
        const isActive =
          selectedWallets.find((wallet: IWallet) => wallet.uuid === uuid) !== undefined

        return (
          <Wallet
            key={`${symbol}/${address}/${chain}`}
            symbol={symbol}
            walletName={walletName}
            name={name}
            address={address}
            chain={chain}
            isActive={isActive}
            onToggle={onToggleAddress(isActive, wallet)}
          />
        )
      })}
    </>
  )

  const renderSelectedCurrencies = selectedCurrencies.length ? (
    <Styles.CurrenciesList>
      {selectedCurrencies.map((item: TCurrency, index: number) => {
        const { symbol, chain } = item

        if (symbol && index < 5) {
          return (
            <Styles.DropdownCurrency key={`${symbol}/${chain}`}>
              <CurrencyLogo symbol={symbol} chain={chain} size={40} />
            </Styles.DropdownCurrency>
          )
        }
        return null
      })}
    </Styles.CurrenciesList>
  ) : null

  const onResetWallets = (): void => {
    setSelectedWallets([])
  }

  const onShowWallets = (): void => {
    setWalletsVisible(true)
  }

  const toggleWalletsDropdown = (value: boolean): void => {
    setWalletsVisible(value)
  }

  const onResetCurrencies = (): void => {
    setSelectedCurrencies([])
  }

  const onRemoveWallet = (uuid: string) => (): void => {
    const removeExist = selectedWallets.filter((item: IWallet) => item.uuid !== uuid)

    setSelectedWallets(removeExist)
  }

  return (
    <DrawerWrapper
      title="Filter history"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      height={540}
    >
      <>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Status</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Styles.Statuses>
              {statuses.map((statusItem: TStatusItem) => {
                const { title, key } = statusItem
                const isActive = status === key

                return (
                  <Styles.Status key={key} isActive={isActive} onClick={selectStatus(key)}>
                    <Styles.StatusTitle>{title}</Styles.StatusTitle>
                  </Styles.Status>
                )
              })}
            </Styles.Statuses>
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Currency</Styles.GroupTitle>
              {selectedCurrencies.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{selectedCurrencies.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon onClick={onResetCurrencies}>
                    <SVG src="../../assets/icons/times.svg" width={8.33} height={8.33} />
                  </Styles.ResetIcon>
                </Styles.ResetGroup>
              ) : null}
            </Styles.GroupHeading>
            <GroupDropdown
              title="Select currencies"
              render={renderCurrencies}
              renderRow={renderSelectedCurrencies}
              maxHeight={150}
            />
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Address</Styles.GroupTitle>
              {selectedWallets.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{selectedWallets.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon onClick={onResetWallets}>
                    <SVG src="../../assets/icons/times.svg" width={8.33} height={8.33} />
                  </Styles.ResetIcon>
                </Styles.ResetGroup>
              ) : null}
            </Styles.GroupHeading>
            <GroupDropdown
              title="Select addresses"
              render={renderAddresses}
              maxHeight={150}
              toggle={toggleWalletsDropdown}
              renderRow={
                selectedWallets.length && !isWalletsVisible ? (
                  <SelectedWallets
                    wallets={selectedWallets}
                    onShowWallets={onShowWallets}
                    onRemove={onRemoveWallet}
                  />
                ) : undefined
              }
              hideArrowOnRender
              paddingOnRender="0px"
            />
          </Styles.Group>
        </Styles.Row>
        <Button label="Apply" onClick={onApply} />
      </>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer

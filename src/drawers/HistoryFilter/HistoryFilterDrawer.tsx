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
import { getWallets, IWallet, getUnique, sortAlphabetically, getWalletName } from '@utils/wallet'
import { getItem, checkOneOfExist, removeItem, setItem, removeMany } from '@utils/storage'
import { toLower } from '@utils/format'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'
import { getToken } from '@tokens/index'

// Hooks
import useState from '@hooks/useState'

// Assets
import timesIcon from '@assets/icons/times.svg'

// Types
import { Props, TStatuses, TStatusItem, TCurrency, IState } from './types'
import { statuses, storageKeys, initialState } from './data'

// Styles
import Styles from './styles'

const HistoryFilterDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onApply } = props

  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    onGetCurrencies()
    onGetWallets()
  }, [])

  React.useEffect(() => {
    if (isActive) {
      checkActiveFilters()
    }
  }, [isActive])

  const checkActiveFilters = (): void => {
    const getStatus = getItem('txHistoryStatus')
    const getCurrencies = getItem('txHistoryCurrencies')
    const getAddresses = getItem('txHistoryAddresses')

    if (getStatus) {
      const findStatus = statuses.find((status: TStatusItem) => status.key === getStatus)

      if (findStatus) {
        updateState({ status: findStatus.key })
      }
    } else {
      updateState({ status: null })
    }

    updateState({
      selectedCurrencies: getCurrencies?.length ? JSON.parse(getCurrencies) : [],
      selectedWallets: getAddresses?.length ? JSON.parse(getAddresses) : [],
    })
  }

  const onGetWallets = (): void => {
    const wallets = getWallets()

    if (wallets) {
      updateState({ wallets })
    }
  }

  const onGetCurrencies = (): void => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const uniqueWallets = getUnique(walletsList)

      const currencies = uniqueWallets.sort(sortAlphabetically).map((wallet: IWallet) => {
        const { chain, symbol, name } = wallet

        const getWalletInfo = chain ? getToken(symbol, chain) : getCurrencyInfo(symbol)

        return {
          symbol: getWalletInfo?.symbol || symbol,
          name: name || getWalletInfo?.name || '',
          chain,
        }
      })

      updateState({ currencies })
    }
  }

  const onApplyFilters = (): void => {
    if (state.status) {
      setItem('txHistoryStatus', state.status)
    } else {
      removeItem('txHistoryStatus')
    }

    if (state.selectedCurrencies.length) {
      setItem('txHistoryCurrencies', JSON.stringify(state.selectedCurrencies))
    } else {
      removeItem('txHistoryCurrencies')
    }

    if (state.selectedWallets.length) {
      setItem('txHistoryAddresses', JSON.stringify(state.selectedWallets))
    } else {
      removeItem('txHistoryAddresses')
    }

    onApply()
  }

  const selectStatus = (status: TStatuses) => (): void => {
    updateState({ status })
  }

  const onToggleCurrency =
    (symbol: string, name: string, isActive: boolean, chain?: string) => (): void => {
      let selectedCurrencies = [...state.selectedCurrencies]

      if (isActive) {
        selectedCurrencies = selectedCurrencies.filter(
          (currency: TCurrency) =>
            toLower(currency.symbol) !== toLower(symbol) ||
            toLower(currency.chain) !== toLower(chain)
        )
      } else {
        selectedCurrencies.push({
          symbol,
          chain,
          name,
        })
      }

      updateState({ selectedCurrencies })
    }

  const renderCurrencies = (
    <>
      {state.currencies.map((currency: TCurrency) => {
        const { symbol, name, chain } = currency
        const isActive =
          state.selectedCurrencies.find(
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

  const onToggleAddress = (isActive: boolean, wallet: IWallet) => (): void => {
    if (isActive) {
      const selectedWallets = state.selectedWallets.filter(
        (item: IWallet) => item.uuid !== wallet.uuid
      )
      updateState({ selectedWallets })
    } else {
      updateState({ selectedWallets: [...state.selectedWallets, wallet] })
    }
  }

  const filterWallets = (wallet: IWallet): boolean | IWallet => {
    if (state.selectedCurrencies.length) {
      return (
        state.selectedCurrencies.find(
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
      {state.wallets.filter(filterWallets).map((wallet: IWallet) => {
        const { symbol, address, chain, name, uuid } = wallet
        const walletName = getWalletName(wallet)
        const isActive =
          state.selectedWallets.find((wallet: IWallet) => wallet.uuid === uuid) !== undefined

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

  const renderSelectedCurrencies = state.selectedCurrencies.length ? (
    <Styles.CurrenciesList>
      {state.selectedCurrencies.map((item: TCurrency, index: number) => {
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
    updateState({ selectedWallets: [] })
  }

  const toggleWalletsDropdown = (isWalletsVisible: boolean): void => {
    updateState({ isWalletsVisible })
  }

  const onResetCurrencies = (): void => {
    updateState({ selectedCurrencies: [] })
  }

  const onRemoveWallet = (uuid: string) => (): void => {
    const selectedWallets = state.selectedWallets.filter((item: IWallet) => item.uuid !== uuid)
    updateState({ selectedWallets })
  }

  const isShowResetButton = (): boolean => {
    return checkOneOfExist(storageKeys)
  }

  const onReset = (): void => {
    removeMany(storageKeys)
    onApply()
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
                const isActive = state.status === key

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
              {state.selectedCurrencies.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{state.selectedCurrencies.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon onClick={onResetCurrencies}>
                    <SVG src={timesIcon} width={8.33} height={8.33} />
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
              {state.selectedWallets.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{state.selectedWallets.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon onClick={onResetWallets}>
                    <SVG src={timesIcon} width={8.33} height={8.33} />
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
                state.selectedWallets.length && !state.isWalletsVisible ? (
                  <SelectedWallets wallets={state.selectedWallets} onRemove={onRemoveWallet} />
                ) : undefined
              }
              hideArrowOnRender
              paddingOnRender="0px"
            />
          </Styles.Group>
        </Styles.Row>
        <Styles.Actions>
          {isShowResetButton() ? (
            <Button label="Reset" isDanger onClick={onReset} mr={7.5} />
          ) : null}
          <Button label="Apply" onClick={onApplyFilters} ml={isShowResetButton() ? 7.5 : 0} />
        </Styles.Actions>
      </>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import GroupDropdown from '@components/GroupDropdown'
import Button from '@components/Button'
import DropdownCurrency from '@components/DropdownCurrency'
import SortButton from './components/SortButton'
import ShowBlock from './components/ShowBlock'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { toLower } from '@utils/format'
import { getItem, removeItem, setItem, removeMany } from '@utils/storage'
import { getWallets, IWallet, getUnique, sortAlphabetically } from '@utils/wallet'

// Hooks
import useState from '@hooks/useState'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Types
import { Props, TSortButton, IState, TCurrency } from './types'
import { initialState, sortButtons } from './data'

// Styles
import Styles from './styles'

const FilterWalletsDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, onApply } = props

  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    checkActiveSortType()
  }, [])

  React.useEffect(() => {
    if (isActive) {
      checkFilters()
      onGetWallets()
      getSelectedCurrencies()
    }
  }, [isActive])

  const checkFilters = (): void => {
    const getHiddenWalletsFilter = getItem('hiddenWalletsFilter')
    const getZeroBalancesFilter = getItem('zeroBalancesFilter')

    if (getHiddenWalletsFilter) {
      updateState({
        isShowHiddenAddress: getHiddenWalletsFilter === 'true',
        isShowPrevHiddenAddress: getHiddenWalletsFilter === 'true',
      })
    }

    if (getZeroBalancesFilter) {
      updateState({
        isShowZeroBalances: getZeroBalancesFilter === 'true',
        isShowPrevZeroBalances: getZeroBalancesFilter === 'true',
      })
    }
  }

  const onGetWallets = (): void => {
    const wallets = getWallets()

    if (wallets?.length) {
      const getZeroBalances = wallets.filter(
        (wallet: IWallet) => wallet.balance === 0 || typeof wallet.balance === 'undefined'
      ).length
      const getHiddenWallets = wallets.filter((wallet: IWallet) => wallet.isHidden === true).length

      updateState({
        totalZeroBalancesWallets: getZeroBalances,
        totalHiddenWallets: getHiddenWallets,
      })

      const uniqueWallets = getUnique(wallets)
      const currenciesList = uniqueWallets.sort(sortAlphabetically).map((wallet: IWallet) => {
        const { chain, symbol, name } = wallet

        const getWalletInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

        return {
          symbol: getWalletInfo?.symbol || symbol,
          name: name || getWalletInfo?.name || '',
          chain,
        }
      })

      updateState({ currenciesList })
    }
  }

  const getSelectedCurrencies = (): void => {
    const getSelectedCurrenciesFilter = getItem('selectedCurrenciesFilter')

    if (getSelectedCurrenciesFilter) {
      const data = JSON.parse(getSelectedCurrenciesFilter)

      updateState({
        selectedCurrencies: data,
        prevSelectedCurrencies: data,
      })
    } else {
      updateState({
        selectedCurrencies: [],
        prevSelectedCurrencies: [],
      })
    }
  }

  const checkActiveSortType = (): void => {
    const getSortKey = getItem('activeSortKey')
    const getSortType = getItem('activeSortType')

    if (getSortKey || getSortType) {
      const findButton = getSortKey
        ? sortButtons.find((button: TSortButton) => toLower(button.key) === toLower(getSortKey))
        : undefined

      if ((findButton && getSortType === 'asc') || getSortType === 'desc') {
        updateState({
          activeSortKey: getSortKey,
          activeSortType: getSortType,
        })
      } else {
        removeItem('activeSortKey')
        removeItem('activeSortType')
      }
    }
  }

  const onToggleCurrency = (currency: TCurrency) => (): void => {
    const { symbol, name, chain } = currency

    const getCurrency = state.currenciesList.find(
      (item: TCurrency) =>
        toLower(item.symbol) === toLower(currency.symbol) &&
        toLower(item.chain) === toLower(currency.chain)
    )

    if (getCurrency) {
      const checkExist = findCurrency(symbol, chain) !== undefined

      if (checkExist) {
        updateState({
          selectedCurrencies: state.selectedCurrencies.filter(
            (i: TCurrency) =>
              toLower(i.symbol) !== toLower(symbol) || toLower(i.chain) !== toLower(chain)
          ),
        })
      } else {
        updateState({
          selectedCurrencies: [...state.selectedCurrencies, ...[{ symbol, chain, name }]],
        })
      }
    }
  }

  const findCurrency = (symbol: string, chain?: string): TCurrency | undefined => {
    return state.selectedCurrencies.find(
      (currency: TCurrency) =>
        toLower(currency.symbol) === toLower(symbol) && toLower(currency.chain) === toLower(chain)
    )
  }

  const renderCurrenciesList = (
    <>
      {state.currenciesList.map((currency: TCurrency) => {
        const { symbol, name, chain } = currency
        const isActive = findCurrency(symbol, chain) !== undefined

        return (
          <DropdownCurrency
            key={`${symbol}/${chain}`}
            symbol={symbol}
            name={name}
            chain={chain}
            isActive={isActive}
            onToggle={onToggleCurrency(currency)}
          />
        )
      })}
    </>
  )

  const onApplyDrawer = (): void => {
    if (state.activeSortKey) {
      setItem('activeSortKey', state.activeSortKey)
    } else {
      removeItem('activeSortKey')
    }

    if (state.activeSortType) {
      setItem('activeSortType', state.activeSortType)
    } else {
      removeItem('activeSortType')
    }

    setItem('hiddenWalletsFilter', state.isShowHiddenAddress.toString())
    setItem('zeroBalancesFilter', state.isShowZeroBalances.toString())

    if (state.selectedCurrencies.length) {
      setItem('selectedCurrenciesFilter', JSON.stringify(state.selectedCurrencies))
    } else {
      removeItem('selectedCurrenciesFilter')
    }

    onApply()
  }

  const onClickButton = (key: string) => (): void => {
    const findButton = sortButtons.find(
      (button: TSortButton) => toLower(button.key) === toLower(key)
    )

    if (findButton) {
      if (state.activeSortKey === key) {
        updateState({
          activeSortType: state.activeSortType === 'asc' ? 'desc' : null,
        })

        if (state.activeSortType === 'desc') {
          updateState({
            activeSortKey: null,
          })
        }
      } else {
        updateState({
          activeSortKey: key,
          activeSortType: 'asc',
        })
      }
    }
  }

  const onRemoveCurrencies = (): void => {
    updateState({
      selectedCurrencies: [],
    })
  }

  const renderSelectedCurrencies = state.selectedCurrencies.length ? (
    <Styles.CurrenciesList>
      {state.selectedCurrencies.map((item: TCurrency, index: number) => {
        const { symbol, chain, name } = item

        if (symbol && index < 5) {
          return (
            <Styles.DropdownCurrency key={`${symbol}/${chain}`}>
              <CurrencyLogo symbol={symbol} chain={chain} size={40} name={name} />
            </Styles.DropdownCurrency>
          )
        }
        return null
      })}
    </Styles.CurrenciesList>
  ) : undefined

  const isButtonDisabled = (): boolean => {
    const {
      isShowPrevHiddenAddress,
      isShowHiddenAddress,
      isShowPrevZeroBalances,
      isShowZeroBalances,
      prevSelectedCurrencies,
      selectedCurrencies,
    } = state

    return (
      isShowPrevHiddenAddress === isShowHiddenAddress &&
      isShowPrevZeroBalances === isShowZeroBalances &&
      prevSelectedCurrencies.length === selectedCurrencies.length
    )
  }

  const isShowResetButton = (): boolean => {
    const getHiddenWalletsFilter = getItem('hiddenWalletsFilter')
    const getZeroBalancesFilter = getItem('zeroBalancesFilter')
    const getSelectedCurrenciesFilter = getItem('selectedCurrenciesFilter')

    return (
      (getHiddenWalletsFilter !== null ||
        getZeroBalancesFilter !== null ||
        getSelectedCurrenciesFilter !== null) &&
      isButtonDisabled()
    )
  }

  const onReset = (): void => {
    removeMany([
      'selectedCurrenciesFilter',
      'hiddenWalletsFilter',
      'zeroBalancesFilter',
      'activeSortKey',
      'activeSortType',
    ])
    updateState(initialState)
    onApply()
  }

  return (
    <DrawerWrapper
      title="Filter wallets"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      height={540}
    >
      <Styles.Container>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Sort by</Styles.GroupTitle>
            </Styles.GroupHeading>

            <Styles.SortTypes>
              {sortButtons.map((sortButton: TSortButton) => {
                const { title, key, width, values } = sortButton
                const type = state.activeSortKey === key ? state.activeSortType : null

                return (
                  <SortButton
                    key={title}
                    title={title}
                    width={width}
                    type={type}
                    values={values}
                    onClick={onClickButton(key)}
                  />
                )
              })}
            </Styles.SortTypes>
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Filter by</Styles.GroupTitle>
              {state.selectedCurrencies.length ? (
                <Styles.GroupClear>
                  <Styles.ClearTitle>{state.selectedCurrencies.length} selected</Styles.ClearTitle>
                  <Styles.ClearButton onClick={onRemoveCurrencies}>
                    <SVG src="../../assets/icons/times.svg" width={7.3} height={7.3} />
                  </Styles.ClearButton>
                </Styles.GroupClear>
              ) : null}
            </Styles.GroupHeading>
            <GroupDropdown
              title="Select currency"
              render={renderCurrenciesList}
              renderRow={renderSelectedCurrencies}
              maxHeight={200}
            />
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Show</Styles.GroupTitle>
            </Styles.GroupHeading>

            <ShowBlock
              title="Hidden wallet"
              count={state.totalHiddenWallets}
              isActive={state.isShowHiddenAddress}
              onToggle={() => updateState({ isShowHiddenAddress: !state.isShowHiddenAddress })}
            />
            <ShowBlock
              title="Zero balances"
              count={state.totalZeroBalancesWallets}
              isActive={state.isShowZeroBalances}
              onToggle={() => updateState({ isShowZeroBalances: !state.isShowZeroBalances })}
            />
          </Styles.Group>
        </Styles.Row>

        <Styles.Actions>
          {isShowResetButton() ? (
            <Button label="Reset" isDanger onClick={onReset} mr={7.5} />
          ) : null}
          <Button label="Apply" onClick={onApplyDrawer} ml={isShowResetButton() ? 7.5 : 0} />
        </Styles.Actions>
      </Styles.Container>
    </DrawerWrapper>
  )
}

export default FilterWalletsDrawer

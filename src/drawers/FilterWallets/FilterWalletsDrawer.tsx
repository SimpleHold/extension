import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrenciesDropdown, { TList } from '@components/CurrenciesDropdown/CurrenciesDropdown'
import Button from '@components/Button'
import Switch from '@components/Switch'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getItem, setItem, removeMany, removeItem } from '@utils/storage'
import { toLower } from '@utils/format'

// Hooks
import useState from '@hooks/useState'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  onApply: () => void
  isActive: boolean
}

type TSelectedCurrency = {
  symbol?: string
  chain?: string
  type?: string
  name?: string
}

interface IState {
  isShowHiddenAddress: boolean
  isShowZeroBalances: boolean
  totalHiddenWallets: number
  totalZeroBalancesWallets: number
  dropDownList: TList[]
  isShowPrevHiddenAddress: boolean
  isShowPrevZeroBalances: boolean
  selectedCurrencies: TSelectedCurrency[]
  isInitialSetup: boolean
}

const FilterWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onApply } = props

  const {
    state: {
      isShowHiddenAddress,
      isShowZeroBalances,
      totalHiddenWallets,
      totalZeroBalancesWallets,
      dropDownList,
      isShowPrevHiddenAddress,
      isShowPrevZeroBalances,
      selectedCurrencies,
      isInitialSetup,
    },
    updateState,
  } = useState<IState>({
    isShowHiddenAddress: false,
    isShowZeroBalances: true,
    totalHiddenWallets: 0,
    totalZeroBalancesWallets: 0,
    dropDownList: [],
    isShowPrevHiddenAddress: false,
    isShowPrevZeroBalances: true,
    selectedCurrencies: [],
    isInitialSetup: true,
  })

  React.useEffect(() => {
    if (isActive) {
      checkFilters()
      getFiltersData()
      getSelectedCurrencies()
    }
  }, [isActive])

  React.useEffect(() => {
    if (
      !isInitialSetup &&
      dropDownList.length &&
      selectedCurrencies.length &&
      dropDownList.length - 1 === selectedCurrencies.length &&
      selectedCurrencies.find((i: TSelectedCurrency) => i.type === 'All') === undefined
    ) {
      updateState({
        selectedCurrencies: [...[{ type: 'All' }], ...selectedCurrencies],
        isInitialSetup: true,
      })
    }
  }, [selectedCurrencies, dropDownList])

  const getSelectedCurrencies = (): void => {
    const getSelectedCurrenciesFilter = getItem('selectedCurrenciesFilter')

    if (getSelectedCurrenciesFilter) {
      const data = JSON.parse(getSelectedCurrenciesFilter)

      updateState({
        selectedCurrencies: data,
      })
    } else {
      updateState({
        selectedCurrencies: [],
      })
    }
  }

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

  const getFilteredCurrencies = (): TList[] | null => {
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

      return wallets
        .filter(
          (v, i, a) =>
            a.findIndex(
              (wallet: IWallet) => wallet.symbol === v.symbol && wallet.chain === v.chain
            ) === i
        )
        .sort((a: IWallet, b: IWallet) => a.symbol.localeCompare(b.symbol))
        .map((wallet: IWallet) => {
          const { chain, symbol, name } = wallet

          const getWalletInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

          return {
            logo: {
              symbol: getWalletInfo?.symbol || symbol,
              width: 40,
              height: 40,
              br: 13,
              name,
              chain,
            },
            value: name || getWalletInfo?.name || '',
            withRadioButton: true,
          }
        })
    }
    return null
  }

  const getFiltersData = (): void => {
    const currencies = getFilteredCurrencies()

    if (currencies) {
      currencies.unshift({
        withRadioButton: true,
        value: 'All',
      })

      updateState({
        dropDownList: currencies,
      })
    }
  }

  const toggleRadioButton = (value: string) => {
    const findListItem = dropDownList.find((list: TList) => list.value === value)

    if (findListItem) {
      const { logo } = findListItem
      const checkExist =
        selectedCurrencies?.find(
          (currency: TSelectedCurrency) =>
            toLower(currency.type) === toLower(value) ||
            (toLower(currency.symbol) === toLower(logo?.symbol) &&
              toLower(currency?.chain) === toLower(logo?.chain))
        ) !== undefined

      if (checkExist) {
        if (value !== 'All' && selectedCurrencies.length > 1) {
          updateState({
            selectedCurrencies: selectedCurrencies.filter(
              (i: TSelectedCurrency) =>
                (i.type !== 'All' && toLower(i.symbol) !== toLower(logo?.symbol)) ||
                toLower(i.chain) !== toLower(logo?.chain)
            ),
          })
        }
      } else {
        if (value === 'All') {
          updateState({
            selectedCurrencies: [
              ...[{ type: 'All' }],
              ...dropDownList.map((list: TList) => {
                return {
                  symbol: list.logo?.symbol,
                  chain: list.logo?.chain,
                  name: list.logo?.name,
                }
              }),
            ],
          })
        } else {
          updateState({
            selectedCurrencies: [
              ...selectedCurrencies.filter((i: TSelectedCurrency) => i.type !== 'All'),
              ...[{ symbol: logo?.symbol, chain: logo?.chain, name: logo?.name }],
            ],
          })
        }
      }
    }
  }

  const onApplyFilters = (): void => {
    setItem('hiddenWalletsFilter', isShowHiddenAddress.toString())
    setItem('zeroBalancesFilter', isShowZeroBalances.toString())

    const filterSelectedCurrencies = selectedCurrencies.filter(
      (item: TSelectedCurrency) => item.type !== 'All'
    )

    if (filterSelectedCurrencies.length) {
      setItem('selectedCurrenciesFilter', JSON.stringify(filterSelectedCurrencies))
    } else {
      removeItem('selectedCurrenciesFilter')
    }
    onApply()
  }

  const isButtonDisabled = (): boolean => {
    return (
      isShowPrevHiddenAddress === isShowHiddenAddress &&
      isShowPrevZeroBalances === isShowZeroBalances
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
    removeMany(['hiddenWalletsFilter', 'zeroBalancesFilter', 'selectedCurrenciesFilter'])
    onApply()
  }

  const dropdownRowList = selectedCurrencies.filter(
    (item: TSelectedCurrency) => item.type === undefined
  )

  const onResetDropdown = (): void => {
    getSelectedCurrencies()
  }

  const onApplyDropdown = (): void => {
    const filterSelectedCurrencies = selectedCurrencies.filter(
      (item: TSelectedCurrency) => item.type !== 'All'
    )

    if (filterSelectedCurrencies.length) {
      setItem('selectedCurrenciesFilter', JSON.stringify(filterSelectedCurrencies))
    }
  }

  const renderDropdownRow = (
    <Styles.Dropdown isEmpty={!selectedCurrencies.length}>
      {selectedCurrencies.length ? (
        <Styles.DropdownRow>
          <Styles.DropdownCurrenciesList>
            {dropdownRowList.map((item: TSelectedCurrency, index: number) => {
              const { symbol, chain, name } = item

              if (symbol && index < 5) {
                return (
                  <Styles.DropdownCurrency key={`${symbol}/${chain}`}>
                    <CurrencyLogo
                      symbol={symbol}
                      chain={chain}
                      width={40}
                      height={40}
                      name={name}
                    />
                  </Styles.DropdownCurrency>
                )
              }
              return null
            })}
          </Styles.DropdownCurrenciesList>
          {dropdownRowList.length > 5 ? <Styles.ThreeDots>...</Styles.ThreeDots> : null}
        </Styles.DropdownRow>
      ) : (
        <Styles.DropdownLabel>Select currency</Styles.DropdownLabel>
      )}
      <Styles.ArrowIconRow>
        <SVG src="../../assets/icons/arrow.svg" width={8} height={14} />
      </Styles.ArrowIconRow>
    </Styles.Dropdown>
  )

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.SelectCurrencyRow>
          <CurrenciesDropdown
            list={dropDownList}
            label="Select currency"
            toggleRadioButton={toggleRadioButton}
            selectedCurrencies={selectedCurrencies}
            renderRow={renderDropdownRow}
            padding="10px"
            withActions
            onClose={onResetDropdown}
            onResetDropdown={onResetDropdown}
            onApplyDropdown={onApplyDropdown}
          />
          {selectedCurrencies.length ? (
            <Styles.SelectedAmount>
              Selected{' '}
              {selectedCurrencies.find((i: TSelectedCurrency) => i.type === 'All') !== undefined
                ? 'all'
                : selectedCurrencies.length}{' '}
              currencies
            </Styles.SelectedAmount>
          ) : null}
        </Styles.SelectCurrencyRow>

        <Styles.DividerLine />

        <Styles.Filter>
          <Styles.FilterRow>
            <Styles.FilterTitle>Show hidden addresses</Styles.FilterTitle>
            <Styles.FilterBadge>
              <Styles.FilterBadgeText>{totalHiddenWallets}</Styles.FilterBadgeText>
            </Styles.FilterBadge>
          </Styles.FilterRow>
          <Styles.SwitchRow>
            <Switch
              value={isShowHiddenAddress}
              onToggle={() => updateState({ isShowHiddenAddress: !isShowHiddenAddress })}
            />
          </Styles.SwitchRow>
        </Styles.Filter>

        <Styles.DividerLine />

        <Styles.Filter>
          <Styles.FilterRow>
            <Styles.FilterTitle>Show zero balances</Styles.FilterTitle>
            <Styles.FilterBadge>
              <Styles.FilterBadgeText>{totalZeroBalancesWallets}</Styles.FilterBadgeText>
            </Styles.FilterBadge>
          </Styles.FilterRow>
          <Styles.SwitchRow>
            <Switch
              value={isShowZeroBalances}
              onToggle={() => updateState({ isShowZeroBalances: !isShowZeroBalances })}
            />
          </Styles.SwitchRow>
        </Styles.Filter>

        <Styles.Actions>
          <Button
            label={isShowResetButton() ? 'Reset' : 'Apply'}
            isSmall
            isDanger={isShowResetButton()}
            onClick={isShowResetButton() ? onReset : onApplyFilters}
          />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FilterWalletsDrawer

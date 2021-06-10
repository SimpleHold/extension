import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrenciesDropdown, { TList } from '@components/CurrenciesDropdown/CurrenciesDropdown'
import Button from '@components/Button'
import Switch from '@components/Switch'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getItem, setItem, removeMany, removeItem } from '@utils/storage'
import { toLower } from '@utils/format'

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
}

const FilterWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onApply } = props

  const [isShowHiddenAddress, setShowHiddenAddress] = React.useState<boolean>(false)
  const [isShowZeroBalances, setShowZeroBalances] = React.useState<boolean>(true)
  const [totalHiddenWallets, setTotalHiddenWallet] = React.useState<number>(0)
  const [totalZeroBalancesWallets, setTotalZeroBalancesWallets] = React.useState<number>(0)
  const [dropDownList, setDropDownList] = React.useState<TList[]>([])
  const [isShowPrevHiddenAddress, setShowPrevHiddenAddress] = React.useState<boolean>(false)
  const [isShowPrevZeroBalances, setShowPrevZeroBalances] = React.useState<boolean>(true)
  const [prevSelectedCurrencies, setPrevSelectedCurrencies] = React.useState<string[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<TSelectedCurrency[]>([])
  const [isInitialSetup, setInitialSetup] = React.useState<boolean>(false)

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
      setSelectedCurrencies([...[{ type: 'All' }], ...selectedCurrencies])
      setInitialSetup(true)
    }
  }, [selectedCurrencies, dropDownList])

  const getSelectedCurrencies = (): void => {
    const getSelectedCurrenciesFilter = getItem('selectedCurrenciesFilter')
    const parseData = getSelectedCurrenciesFilter
      ? JSON.parse(getSelectedCurrenciesFilter)
      : [{ type: 'All' }]

    setSelectedCurrencies(parseData)
    setPrevSelectedCurrencies(parseData)
  }

  const checkFilters = (): void => {
    const getHiddenWalletsFilter = getItem('hiddenWalletsFilter')
    const getZeroBalancesFilter = getItem('zeroBalancesFilter')

    if (getHiddenWalletsFilter) {
      setShowHiddenAddress(getHiddenWalletsFilter === 'true')
      setShowPrevHiddenAddress(getHiddenWalletsFilter === 'true')
    }

    if (getZeroBalancesFilter) {
      setShowZeroBalances(getZeroBalancesFilter === 'true')
      setShowPrevZeroBalances(getZeroBalancesFilter === 'true')
    }
  }

  const getFiltersData = (): void => {
    const wallets = getWallets()

    if (wallets?.length) {
      const getZeroBalances = wallets.filter(
        (wallet: IWallet) => wallet.balance === 0 || typeof wallet.balance === 'undefined'
      ).length
      const getHiddenWallets = wallets.filter((wallet: IWallet) => wallet.isHidden === true).length

      setTotalZeroBalancesWallets(getZeroBalances)
      setTotalHiddenWallet(getHiddenWallets)

      const mapDropDownList: TList[] = wallets
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

      mapDropDownList.unshift({
        withRadioButton: true,
        value: 'All',
      })

      setDropDownList(mapDropDownList)
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
          setSelectedCurrencies(
            selectedCurrencies.filter(
              (i: TSelectedCurrency) =>
                (i.type !== 'All' && toLower(i.symbol) !== toLower(logo?.symbol)) ||
                toLower(i.chain) !== toLower(logo?.chain)
            )
          )
        }
      } else {
        if (value === 'All') {
          setSelectedCurrencies([
            ...[{ type: 'All' }],
            ...dropDownList.map((list: TList) => {
              return {
                symbol: list.logo?.symbol,
                chain: list.logo?.chain,
              }
            }),
          ])
        } else {
          setSelectedCurrencies([
            ...selectedCurrencies.filter((i: TSelectedCurrency) => i.type !== 'All'),
            ...[{ symbol: logo?.symbol, chain: logo?.chain }],
          ])
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
    removeMany(['hiddenWalletsFilter', 'zeroBalancesFilter', 'selectedCurrenciesFilter'])
    onApply()
  }

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.SelectCurrencyRow>
          <CurrenciesDropdown
            list={dropDownList}
            label="Select currency"
            toggleRadioButton={toggleRadioButton}
            selectedCurrencies={selectedCurrencies}
          />
          <Styles.SelectedAmount>
            Selected{' '}
            {selectedCurrencies.find((i: TSelectedCurrency) => i.type === 'All') !== undefined
              ? 'all'
              : selectedCurrencies.length}{' '}
            currencies
          </Styles.SelectedAmount>
        </Styles.SelectCurrencyRow>

        <Styles.DividerLine />

        <Styles.Filter>
          <Styles.FilterRow>
            <Styles.FilterTitle>Show hidden wallet</Styles.FilterTitle>
            <Styles.FilterBadge>
              <Styles.FilterBadgeText>{totalHiddenWallets}</Styles.FilterBadgeText>
            </Styles.FilterBadge>
          </Styles.FilterRow>
          <Styles.SwitchRow>
            <Switch
              value={isShowHiddenAddress}
              onToggle={() => setShowHiddenAddress((prevValue: boolean) => !prevValue)}
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
              onToggle={() => setShowZeroBalances((prevValue: boolean) => !prevValue)}
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

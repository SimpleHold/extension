import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrenciesDropdown, { TList } from '@components/CurrenciesDropdown/CurrenciesDropdown'
import Button from '@components/Button'
import Switch from '@components/Switch'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getItem, setItem, removeMany } from '@utils/storage'

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

const FilterWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onApply } = props

  const [isShowHiddenAddress, setShowHiddenAddress] = React.useState<boolean>(false)
  const [isShowZeroBalances, setShowZeroBalances] = React.useState<boolean>(true)
  const [totalHiddenWallets, setTotalHiddenWallet] = React.useState<number>(0)
  const [totalZeroBalancesWallets, setTotalZeroBalancesWallets] = React.useState<number>(0)
  const [dropDownList, setDropDownList] = React.useState<TList[]>([])
  const [isShowPrevHiddenAddress, setShowPrevHiddenAddress] = React.useState<boolean>(false)
  const [isShowPrevZeroBalances, setShowPrevZeroBalances] = React.useState<boolean>(true)
  const [radioButtonValues, setRadioButtonValues] = React.useState<string[]>([])
  const [prevSelectedCurrencies, setPrevSelectedCurrencies] = React.useState<string[]>([])

  React.useEffect(() => {
    if (isActive) {
      checkFilters()
      getFiltersData()
      getSelectedCurrencies()
    }
  }, [isActive])

  const getSelectedCurrencies = (): void => {
    const getSelectedCurrenciesFilter = getItem('selectedCurrenciesFilter')
    const parseData = getSelectedCurrenciesFilter
      ? JSON.parse(getSelectedCurrenciesFilter)
      : ['All']

    setRadioButtonValues(parseData)
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
        .filter((v, i, a) => a.findIndex((t) => t.symbol === v.symbol) === i)
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
      const checkExist = radioButtonValues.indexOf(value) !== -1

      if (checkExist) {
        if (value !== 'All' && radioButtonValues.length > 1) {
          setRadioButtonValues(
            radioButtonValues.filter((item: string) => item !== 'All' && item !== value)
          )
        }
      } else {
        if (value === 'All') {
          setRadioButtonValues(['All', ...dropDownList.map((list: TList) => list.value)])
        } else {
          setRadioButtonValues([
            ...radioButtonValues.filter((item: string) => item !== 'All'),
            value,
          ])
        }
      }
    }
  }

  const onApplyFilters = (): void => {
    setItem('hiddenWalletsFilter', isShowHiddenAddress.toString())
    setItem('zeroBalancesFilter', isShowZeroBalances.toString())
    const filterSelectedCurrencies = radioButtonValues.filter((item: string) => item !== 'All')
    if (filterSelectedCurrencies.length) {
      setItem('selectedCurrenciesFilter', JSON.stringify(filterSelectedCurrencies))
    }
    onApply()
  }

  const isButtonDisabled = (): boolean => {
    return (
      isShowPrevHiddenAddress === isShowHiddenAddress &&
      isShowPrevZeroBalances === isShowZeroBalances &&
      JSON.stringify(prevSelectedCurrencies) === JSON.stringify(radioButtonValues)
    )
  }

  const onReset = (): void => {
    removeMany(['hiddenWalletsFilter', 'zeroBalancesFilter', 'selectedCurrenciesFilter'])
    onApply()
  }

  const isShowResetButton = (): boolean => {
    if (
      getItem('hiddenWalletsFilter') ||
      getItem('zeroBalancesFilter') ||
      (getItem('selectedCurrenciesFilter') && isButtonDisabled())
    ) {
      return true
    }
    return false
  }

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.SelectCurrencyRow>
          <CurrenciesDropdown
            list={dropDownList}
            label="Select currency"
            toggleRadioButton={toggleRadioButton}
            radioButtonValues={radioButtonValues}
          />
          <Styles.SelectedAmount>
            Selected {radioButtonValues.indexOf('All') !== -1 ? 'All' : radioButtonValues.length}{' '}
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
            disabled={isShowResetButton() ? false : isButtonDisabled()}
            onClick={isShowResetButton() ? onReset : onApplyFilters}
          />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FilterWalletsDrawer

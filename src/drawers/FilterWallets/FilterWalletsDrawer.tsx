import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrenciesDropdown, { TList } from '@components/CurrenciesDropdown/CurrenciesDropdown'
import Button from '@components/Button'
import Switch from '@components/Switch'

// Utils
import { getWallets, IWallet } from '@utils/wallet'

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

  const [showHiddenAddress, setShowHiddenAddress] = React.useState<boolean>(true)
  const [showZeroBalances, setShowZeroBalances] = React.useState<boolean>(true)
  const [totalHiddenWallets, setTotalHiddenWallet] = React.useState<number>(0)
  const [totalZeroBalancesWallets, setTotalZeroBalancesWallets] = React.useState<number>(0)
  const [dropDownList, setDropDownList] = React.useState<TList[]>([])
  const [selectedWallets, setSelectedWallets] = React.useState<string[]>([])

  React.useEffect(() => {
    checkFilters()
    getFiltersData()
  }, [])

  React.useEffect(() => {
    if (dropDownList.length && dropDownList[0].value !== 'All') {
      dropDownList.unshift({
        radioButtonValue: selectedWallets.length === dropDownList.length,
        value: 'All',
      })
    }
  }, [dropDownList])

  const checkFilters = (): void => {
    const getHiddenWalletsFilter = localStorage.getItem('hiddenWalletsFilter')
    const getZeroBalancesFilter = localStorage.getItem('seroBalancesFilter')

    if (getHiddenWalletsFilter) {
      setShowHiddenAddress(getHiddenWalletsFilter === 'true')
    }

    if (getZeroBalancesFilter) {
      setShowZeroBalances(getZeroBalancesFilter === 'true')
    }
  }

  const getFiltersData = (): void => {
    const wallets = getWallets()

    if (wallets?.length) {
      setSelectedWallets(wallets.map((wallet: IWallet) => wallet.symbol))

      const getZeroBalances = wallets.filter(
        (wallet: IWallet) => wallet.balance === 0 || typeof wallet.balance === 'undefined'
      ).length
      const getHiddenWallets = wallets.filter((wallet: IWallet) => wallet.isHidden === true).length

      setTotalZeroBalancesWallets(getZeroBalances)
      setTotalHiddenWallet(getHiddenWallets)

      const mapDropDownList = wallets
        .filter((v, i, a) => a.findIndex((t) => t.symbol === v.symbol) === i)
        .sort((a: IWallet, b: IWallet) => a.symbol.localeCompare(b.symbol))
        .map((wallet: IWallet) => {
          const { chain, symbol } = wallet

          const getWalletInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

          return {
            logo: {
              symbol,
              width: 40,
              height: 40,
              br: 13,
              background: getWalletInfo ? getWalletInfo.background : '#1D1D22',
            },
            value: getWalletInfo?.name || '',
            radioButtonValue: selectedWallets.indexOf(symbol) !== -1,
          }
        })

      setDropDownList(mapDropDownList)
    }
  }

  const onSelectDropdown = (index: number): void => {}

  const toggleRadioButton = (value: string) => {
    setSelectedWallets(['btc'])
  }

  const isButtonDisabled = false // Fix me

  return (
    <DrawerWrapper title="Filters" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <Styles.SelectCurrencyRow>
          <CurrenciesDropdown
            list={dropDownList}
            onSelect={onSelectDropdown}
            label="Select currency"
            toggleRadioButton={toggleRadioButton}
          />
          <Styles.SelectedAmount>Selected all currencies</Styles.SelectedAmount>
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
              value={showHiddenAddress}
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
              value={showZeroBalances}
              onToggle={() => setShowZeroBalances((prevValue: boolean) => !prevValue)}
            />
          </Styles.SwitchRow>
        </Styles.Filter>

        <Styles.Actions>
          <Button label="Apply" isSmall disabled={isButtonDisabled} onClick={onApply} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FilterWalletsDrawer

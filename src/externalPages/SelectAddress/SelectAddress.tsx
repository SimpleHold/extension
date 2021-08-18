import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import WalletCard from '@components/WalletCard'
import CurrenciesDropdown from '@components/CurrenciesDropdown'

// Utils
import { getWalletName, getWallets, IWallet } from '@utils/wallet'
import { toLower, toUpper } from '@utils/format'
import { getItem, removeItem } from '@utils/storage'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  wallets: null,
  isFiltersActive: false,
  selectedCurrency: null,
  tabInfo: null,
  isDraggable: false,
}

const SelectAddress: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    getWalletsList()
    getQueryParams()
    checkActiveTab()

    document.body.style.overflow = 'hidden'
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === 'Escape' || key === 'Esc') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const checkActiveTab = () => {
    const tabInfo: string | null = getItem('tab')

    if (tabInfo) {
      const parseTabInfo = JSON.parse(tabInfo)

      const { favIconUrl = undefined, url = undefined } = parseTabInfo

      if (favIconUrl && url) {
        updateState({
          tabInfo: {
            favIconUrl,
            url: new URL(url).host,
          },
        })
      }
    }
  }

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryCurrency = searchParams.get('currency')
    const queryChain = searchParams.get('chain')
    const queryDraggable = searchParams.get('isDraggable')

    const parseChain = queryChain !== 'null' && queryChain !== null ? queryChain : null

    if (queryCurrency !== 'null' && queryCurrency !== null) {
      const getCurrencyInfo = parseChain
        ? getToken(queryCurrency, parseChain)
        : getCurrency(queryCurrency)

      if (getCurrencyInfo) {
        const { symbol, name, background } = getCurrencyInfo

        updateState({
          selectedCurrency: {
            symbol,
            name,
            background,
            chain: parseChain || undefined,
          },
        })
      }
    }

    if (queryDraggable === 'true') {
      updateState({ isDraggable: true })
    }
  }

  const getWalletsList = () => {
    const wallets = getWallets()

    if (wallets) {
      updateState({ wallets })
    }
  }

  const onClose = (): void => {
    window.close()

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })
  }

  const handleClick = (address: string) => (): void => {
    browser.runtime.sendMessage({
      type: 'set_address',
      data: {
        address,
      },
    })

    if (getItem('tab')) {
      removeItem('tab')
    }
    onClose()
  }

  const onSelectCurrency = (index: number): void => {
    const currency = getDropdownList()[index]
    const getCurrencyInfo = currency.logo?.chain
      ? getToken(currency.logo.symbol, currency.logo.chain)
      : getCurrency(currency.logo.symbol)

    if (getCurrencyInfo) {
      const { symbol, name, background } = getCurrencyInfo

      updateState({
        selectedCurrency: {
          symbol,
          name,
          background,
          chain: currency.logo.chain || undefined,
        },
      })
    }
  }

  const getDropdownList = () => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const mapWallets = walletsList
        .filter(
          (v, i, a) =>
            a.findIndex(
              (wallet: IWallet) => wallet.symbol === v.symbol && wallet.chain === v.chain
            ) === i
        )
        .filter(
          (wallet: IWallet) =>
            toLower(wallet.symbol) !== toLower(state.selectedCurrency?.symbol) ||
            toLower(wallet.chain) !== toLower(state.selectedCurrency?.chain)
        )

      return mapWallets.map((wallet: IWallet) => {
        const getCurrencyInfo = wallet?.chain
          ? getToken(wallet.symbol, wallet.chain)
          : getCurrency(wallet.symbol)

        return {
          logo: {
            symbol: wallet?.symbol,
            width: 40,
            height: 40,
            br: 13,
            background: getCurrencyInfo?.background || '',
            chain: wallet.chain,
          },
          value: getCurrencyInfo?.name || '',
        }
      })
    }
    return []
  }

  const filterWallets = state.wallets?.filter((wallet: IWallet) => {
    if (state.selectedCurrency) {
      return (
        toLower(wallet.symbol) === toLower(state.selectedCurrency.symbol) &&
        toLower(wallet?.chain) === toLower(state.selectedCurrency?.chain)
      )
    }
    return wallet
  })

  const toggleFilters = (): void => {
    updateState({ isFiltersActive: !state.isFiltersActive })
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={state.isDraggable}>
      <Styles.Body>
        <Styles.Row>
          <Styles.Title>Select Address</Styles.Title>

          {state.tabInfo ? (
            <Styles.SiteBlock>
              <Styles.UseOn>To use it on </Styles.UseOn>
              <Styles.SiteInfo>
                <Styles.SiteFavicon src={state.tabInfo.favIconUrl} />
                <Styles.SiteUrl>{state.tabInfo.url}</Styles.SiteUrl>
              </Styles.SiteInfo>
            </Styles.SiteBlock>
          ) : null}
        </Styles.Row>

        <Styles.Addresses>
          <Styles.AddressesRow>
            <Styles.AddressesLabel>
              {state.selectedCurrency
                ? `My ${toUpper(state.selectedCurrency.symbol)} addresses`
                : 'My addresses'}
            </Styles.AddressesLabel>
            <Styles.FiltersButton onClick={toggleFilters} isActive={state.isFiltersActive}>
              <SVG src="../../assets/icons/filter.svg" width={20} height={16} />
            </Styles.FiltersButton>
          </Styles.AddressesRow>

          <Styles.FiltersRow isActive={state.isFiltersActive}>
            <CurrenciesDropdown
              label="Select currency"
              value={state.selectedCurrency?.name}
              currencySymbol={state.selectedCurrency?.symbol}
              background={state.selectedCurrency?.background}
              tokenChain={state.selectedCurrency?.chain}
              list={getDropdownList()}
              onSelect={onSelectCurrency}
              currencyBr={13}
              disabled={getDropdownList().length < 1 && state.selectedCurrency !== null}
            />
          </Styles.FiltersRow>

          {filterWallets?.length ? (
            <Styles.AddressesList>
              {filterWallets.map((wallet: IWallet, index: number) => {
                const {
                  address,
                  symbol,
                  chain,
                  name,
                  contractAddress,
                  decimals,
                  uuid,
                  hardware,
                } = wallet

                const walletName =
                  wallet.walletName ||
                  getWalletName(filterWallets, symbol, uuid, hardware, chain, name)

                return (
                  <WalletCard
                    key={`${address}/${index}`}
                    address={address}
                    chain={chain}
                    symbol={symbol.toLowerCase()}
                    name={name}
                    contractAddress={contractAddress}
                    decimals={decimals}
                    handleClick={handleClick(address)}
                    walletName={walletName}
                    uuid={uuid}
                    hardware={hardware}
                  />
                )
              })}
            </Styles.AddressesList>
          ) : (
            <Styles.NotFound>Addresses was not found</Styles.NotFound>
          )}
        </Styles.Addresses>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<SelectAddress />, document.getElementById('select-address'))

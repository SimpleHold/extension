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
import { getWallets, IWallet } from '@utils/wallet'
import { toLower, toUpper } from '@utils/format'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

type TSelectedCurrency = {
  symbol: string
  name: string
  background: string
  chain?: string
}

type TabInfo = {
  favIconUrl: string
  url: string
}

const SelectAddress: React.FC = () => {
  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [siteUrl, setSiteUrl] = React.useState<null | string>(null)
  const [siteFavicon, setSiteFavicon] = React.useState<null | string>(null)
  const [isFiltersActive, setFiltersActive] = React.useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = React.useState<TSelectedCurrency | null>(null)
  const [tabInfo, setTabInfo] = React.useState<TabInfo | null>(null)

  React.useEffect(() => {
    getWalletsList()
    getRequesterSiteInfo()
    getInitialCurrency()
    checkActiveTab()

    document.body.style.overflow = 'hidden'
  }, [])

  const checkActiveTab = () => {
    const tabInfo: string | null = localStorage.getItem('tab')

    if (tabInfo) {
      const parseTabInfo = JSON.parse(tabInfo)

      const { favIconUrl = undefined, url = undefined } = parseTabInfo

      if (favIconUrl && url) {
        setTabInfo({
          favIconUrl,
          url: new URL(url).host,
        })
      }
    }
  }

  const getInitialCurrency = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryCurrency = searchParams.get('currency')
    const queryChain = searchParams.get('chain')

    const parseChain = queryChain !== 'null' && queryChain !== null ? queryChain : null

    if (queryCurrency !== 'null' && queryCurrency !== null) {
      const getCurrencyInfo = parseChain
        ? getToken(queryCurrency, parseChain)
        : getCurrency(queryCurrency)

      if (getCurrencyInfo) {
        const { symbol, name, background } = getCurrencyInfo

        setSelectedCurrency({
          symbol,
          name,
          background,
          chain: parseChain || undefined,
        })
      }
    }
  }

  const getRequesterSiteInfo = (): void => {
    const data = localStorage.getItem('requesterSite')

    if (data) {
      const parseData = JSON.parse(data)

      if (parseData.url) {
        setSiteUrl(parseData.url)
      }

      if (parseData.favicon) {
        setSiteFavicon(parseData.favicon)
      }
    }
  }

  const getWalletsList = () => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList)
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const handleClick = (address: string) => {
    browser.runtime.sendMessage({
      type: 'set_address',
      data: {
        address,
      },
    })

    if (localStorage.getItem('tab')) {
      localStorage.removeItem('tab')
    }
    onClose()
  }

  const onSelectCurrency = (index: number): void => {
    const currency = getDropdownList()[index]
    const getCurrencyInfo = currency.logo?.chain
      ? getToken(currency.logo.symbol, currency.logo.chain)
      : getCurrency(currency.logo.symbol)

    if (getCurrencyInfo) {
      const { symbol, name, background, chain } = getCurrencyInfo

      setSelectedCurrency({
        symbol,
        name,
        background,
        chain: currency.logo.chain || undefined,
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
            toLower(wallet.symbol) !== toLower(selectedCurrency?.symbol) ||
            toLower(wallet.chain) !== toLower(selectedCurrency?.chain)
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

  const filterWallets = wallets?.filter((wallet: IWallet) => {
    if (selectedCurrency) {
      return (
        toLower(wallet.symbol) === toLower(selectedCurrency.symbol) &&
        toLower(wallet?.chain) === toLower(selectedCurrency?.chain)
      )
    }
    return wallet
  })

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green">
      <Styles.Body>
        <Styles.Row>
          <Styles.Title>Select Address</Styles.Title>

          {(siteUrl && siteFavicon) || tabInfo ? (
            <Styles.SiteBlock>
              <Styles.UseOn>To use it on </Styles.UseOn>
              {tabInfo ? (
                <Styles.SiteInfo>
                  <Styles.SiteFavicon src={tabInfo.favIconUrl} />
                  <Styles.SiteUrl>{tabInfo.url}</Styles.SiteUrl>
                </Styles.SiteInfo>
              ) : (
                <Styles.SiteInfo>
                  {siteFavicon && siteUrl ? (
                    <Styles.SiteFavicon src={`https://${siteUrl}${siteFavicon}`} />
                  ) : null}
                  {siteUrl ? <Styles.SiteUrl>{siteUrl}</Styles.SiteUrl> : null}
                </Styles.SiteInfo>
              )}
            </Styles.SiteBlock>
          ) : null}
        </Styles.Row>

        <Styles.Addresses>
          <Styles.AddressesRow>
            <Styles.AddressesLabel>
              {selectedCurrency
                ? `My ${toUpper(selectedCurrency.symbol)} addresses`
                : 'My addresses'}
            </Styles.AddressesLabel>
            <Styles.FiltersButton
              onClick={() => setFiltersActive((prevState: boolean) => !prevState)}
              isActive={isFiltersActive}
            >
              <SVG src="../../assets/icons/filter.svg" width={20} height={16} />
            </Styles.FiltersButton>
          </Styles.AddressesRow>

          <Styles.FiltersRow isActive={isFiltersActive}>
            <CurrenciesDropdown
              label="Select currency"
              value={selectedCurrency?.name}
              currencySymbol={selectedCurrency?.symbol}
              background={selectedCurrency?.background}
              tokenChain={selectedCurrency?.chain}
              list={getDropdownList()}
              onSelect={onSelectCurrency}
              currencyBr={13}
              disabled={getDropdownList().length < 1 && selectedCurrency !== null}
            />
          </Styles.FiltersRow>

          {filterWallets?.length ? (
            <Styles.AddressesList>
              {filterWallets.map((wallet: IWallet, index: number) => {
                const { address, symbol, chain, name, contractAddress, decimals } = wallet

                return (
                  <WalletCard
                    key={`${address}/${index}`}
                    address={address}
                    chain={chain}
                    symbol={symbol.toLowerCase()}
                    name={name}
                    contractAddress={contractAddress}
                    decimals={decimals}
                    handleClick={() => handleClick(address)}
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

import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Components
import Cover from '@components/Cover'
import WalletCard from '@components/WalletCard'
import CurrenciesDropdown from '@components/CurrenciesDropdown'

// Utils
import { getWallets, IWallet } from '@utils/wallet'

// Styles
import Styles from './styles/selectAddress.page'

const SelectAddress: React.FC = () => {
  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [siteUrl, setSiteUrl] = React.useState<null | string>(null)
  const [siteFavicon, setSiteFavicon] = React.useState<null | string>(null)
  const [isFiltersActive, setFiltersActive] = React.useState<boolean>(false)

  React.useEffect(() => {
    getWalletsList()
    getRequesterSiteInfo()
  }, [])

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
    onClose()
  }

  const onSelectCurrency = (index: number): void => {}

  const getDropdownList = () => {
    return [
      {
        logo: {
          symbol: 'eth',
          width: 40,
          height: 40,
          br: 20,
          background: '#132BD8',
        },
        value: 'Ethereum',
      },
    ]
  }

  return (
    <Styles.Wrapper>
      <style
        dangerouslySetInnerHTML={{
          __html: `body { padding: 0; margin: 0;font-family: 'Roboto', sans-serif;}`,
        }}
      />
      <Styles.Extension>
        <Cover />
        <Styles.Header>
          <Styles.Logo>
            <SVG src="./assets/logo.svg" width={30} height={24} />
          </Styles.Logo>
          <Styles.CloseButton onClick={onClose}>
            <SVG src="./assets/icons/times.svg" width={16} height={16} />
          </Styles.CloseButton>
        </Styles.Header>
        <Styles.Body>
          <Styles.Row>
            <Styles.Title>Select Address</Styles.Title>

            {siteUrl || siteFavicon ? (
              <Styles.SiteBlock>
                <Styles.UseOn>To use it on </Styles.UseOn>

                <Styles.SiteInfo>
                  {siteFavicon && siteUrl ? (
                    <Styles.SiteFavicon src={`${siteUrl}/${siteFavicon}`} />
                  ) : null}
                  {siteUrl ? <Styles.SiteUrl>{siteUrl}</Styles.SiteUrl> : null}
                </Styles.SiteInfo>
              </Styles.SiteBlock>
            ) : null}
          </Styles.Row>

          <Styles.Addresses>
            <Styles.AddressesRow>
              <Styles.AddressesLabel>My ETH addresses</Styles.AddressesLabel>
              <Styles.FiltersButton
                onClick={() => setFiltersActive((prevState: boolean) => !prevState)}
                isActive={isFiltersActive}
              >
                <SVG src="./assets/icons/filter.svg" width={20} height={16} />
              </Styles.FiltersButton>
            </Styles.AddressesRow>

            <Styles.FiltersRow isActive={isFiltersActive}>
              <CurrenciesDropdown
                label="Select currency"
                value="Ethereum"
                currencySymbol="eth"
                list={getDropdownList()}
                onSelect={onSelectCurrency}
                currencyBr={13}
              />
            </Styles.FiltersRow>

            {wallets?.length ? (
              <Styles.AddressesList>
                {wallets.map((wallet: IWallet, index: number) => {
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
            ) : null}
          </Styles.Addresses>
        </Styles.Body>
      </Styles.Extension>
    </Styles.Wrapper>
  )
}

render(<SelectAddress />, document.getElementById('select-address'))

import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Components
import Cover from '@components/Cover'
import WalletCard from '@components/WalletCard'

// Styles
import Styles from './styles/selectAddress.page'

const SelectAddress: React.FC = () => {
  const onClose = (): void => {
    window.close()
  }

  const handleClick = async (address: string) => {
    await browser.runtime.sendMessage({
      type: 'set_address',
      data: {
        address,
      },
    })
    onClose()
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

            <Styles.SiteBlock>
              <Styles.UseOn>To use it on </Styles.UseOn>

              <Styles.SiteInfo>
                <Styles.SiteFavicon />
                <Styles.SiteUrl>simpleswap.io</Styles.SiteUrl>
              </Styles.SiteInfo>
            </Styles.SiteBlock>
          </Styles.Row>

          <Styles.Addresses>
            <Styles.AddressesRow>
              <Styles.AddressesLabel>My ETH addresses</Styles.AddressesLabel>
              <Styles.FiltersButton>
                <SVG src="./assets/icons/filter.svg" width={20} height={16} />
              </Styles.FiltersButton>
            </Styles.AddressesRow>

            <Styles.AddressesList>
              <WalletCard
                address="address"
                symbol="eth"
                name="Ethereum"
                handleClick={() => handleClick('address')}
              />
            </Styles.AddressesList>
          </Styles.Addresses>
        </Styles.Body>
      </Styles.Extension>
    </Styles.Wrapper>
  )
}

render(<SelectAddress />, document.getElementById('select-address'))

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import CurrencyAddress from '@components/CurrencyAddress'

// Utils
import { toLower } from '@utils/format'

// Types
import { TSelectedAddress } from './types'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  addresses: string[]
  name?: string
  onConnect: (symbol: string) => void
  selectedAddresses: TSelectedAddress[]
  onToggleSelect: (
    isSelected: boolean,
    symbol: string,
    address: string,
    index: number,
    isDisabled: boolean
  ) => () => void
  existWallets: TSelectedAddress[]
}

const MAX_ADDRESSES_NUMBER = 100

const Currency: React.FC<Props> = (props) => {
  const {
    symbol,
    addresses,
    name,
    onConnect,
    selectedAddresses,
    onToggleSelect,
    existWallets,
  } = props

  const onClickHeading = (): void => {
    if (!addresses.length) {
      onConnect(symbol)
    }
  }

  const onGetNextAddress = (): void => {
    onConnect(symbol)
  }

  return (
    <Styles.CurrencyItem>
      <Styles.CurrencyHeading isActive={addresses.length > 0} onClick={onClickHeading}>
        <CurrencyLogo symbol={symbol} size={30} br={10} />
        <Styles.CurrencyHeadingRow>
          <Styles.CurrencyName>{name}</Styles.CurrencyName>
          {!addresses.length ? (
            <Styles.AddAddressButton>
              <SVG src="../../assets/icons/plusCircle.svg" width={20} height={20} />
            </Styles.AddAddressButton>
          ) : null}
        </Styles.CurrencyHeadingRow>
      </Styles.CurrencyHeading>

      {addresses?.length ? (
        <Styles.CurrencyBody>
          {addresses.map((address: string, index: number) => {
            const isSelected =
              selectedAddresses.find(
                (item: TSelectedAddress) =>
                  toLower(item.address) === toLower(address) &&
                  toLower(item.symbol) === toLower(symbol)
              ) !== undefined

            const isDisabled =
              existWallets.find(
                (wallet: TSelectedAddress) =>
                  toLower(wallet.address) === toLower(address) &&
                  toLower(wallet.symbol) === toLower(symbol)
              ) !== undefined

            return (
              <CurrencyAddress
                key={`${symbol}/${address}`}
                address={address}
                symbol={symbol}
                isSelected={isSelected || isDisabled}
                onToggle={onToggleSelect(isSelected, symbol, address, index, isDisabled)}
                isDisabled={isDisabled}
              />
            )
          })}

          {addresses.length < MAX_ADDRESSES_NUMBER ? (
            <Styles.NextAddressRow onClick={onGetNextAddress}>
              <Styles.NextAddressLabel>Next addresses</Styles.NextAddressLabel>
              <SVG src="../../assets/icons/bottomArrow.svg" width={7} height={4} />
            </Styles.NextAddressRow>
          ) : null}
        </Styles.CurrencyBody>
      ) : null}
    </Styles.CurrencyItem>
  )
}

export default Currency

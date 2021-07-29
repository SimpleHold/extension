import * as React from 'react'
import SVG from 'react-inlinesvg'
import type Transport from '@ledgerhq/hw-transport-webusb'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import CurrencyAddress from '@components/CurrencyAddress'
import Alert from './Alert'

// Config
import { getCurrency } from '@config/currencies'

// Utils
import { getBTCAddress, getETHAddress, getXRPAddress, requestTransport } from '@utils/ledger'
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

type TSelectedAddress = {
  address: string
  path: string
  symbol: string
}

interface Props {
  symbol: string
  transport: Transport
  selectedAddresses: TSelectedAddress[]
  existWallets: TSelectedAddress[]
  onToggleSelect: (
    isSelected: boolean,
    symbol: string,
    address: string,
    index: number,
    isDisabled: boolean
  ) => () => void
  saveFirstAddress: (symbol: string, address: string) => void
}

const Currency: React.FC<Props> = (props) => {
  const {
    symbol,
    transport,
    selectedAddresses,
    existWallets,
    onToggleSelect,
    saveFirstAddress,
  } = props

  const [addresses, setAddresses] = React.useState<string[]>([])
  const [index, setIndex] = React.useState<number>(0)
  const [isTransportError, setTransportError] = React.useState<boolean>(false)
  const [isDisconnectError, setDisconnectError] = React.useState<boolean>(false)
  const [ledgerTransport, setLedgerTransport] = React.useState<Transport>(transport)

  const isActive = addresses.length > 0 || isTransportError || isDisconnectError

  const currencyInfo = getCurrency(symbol)

  const getAddress = async (): Promise<void> => {
    let request

    if (isTransportError) {
      setTransportError(false)
    }

    if (isDisconnectError) {
      setDisconnectError(false)
    }

    if (symbol === 'btc') {
      request = await getBTCAddress(index, ledgerTransport)
    } else if (symbol === 'eth') {
      request = await getETHAddress(index, ledgerTransport)
    } else {
      request = await getXRPAddress(index, ledgerTransport)
    }

    if (typeof request === 'string') {
      setAddresses([...addresses, request])
      setIndex((prevValue: number) => prevValue + 1)

      if (index === 0) {
        saveFirstAddress(symbol, request)
      }
    } else {
      const { name } = request

      if (name === 'TransportStatusError') {
        setTransportError(true)
      } else if (name === 'DisconnectedDeviceDuringOperation') {
        setDisconnectError(true)
      }
    }
  }

  const onReconnect = async (): Promise<void> => {
    const getTransport = await requestTransport()

    if (getTransport) {
      setLedgerTransport(getTransport)
      setDisconnectError(false)
      getAddress()
    }
  }

  const onClickHeading = (): void => {
    if (!isActive) {
      getAddress()
    }
  }

  return (
    <Styles.Currency>
      <Styles.CurrencyHeading onClick={onClickHeading} isActive={isActive}>
        <CurrencyLogo symbol={symbol} width={30} height={30} br={10} />
        <Styles.CurrencyHeadingRow>
          {currencyInfo ? <Styles.CurrencyName>{currencyInfo.name}</Styles.CurrencyName> : null}
          {!isActive ? (
            <Styles.AddAddressButton>
              <SVG src="../../assets/icons/plusCircle.svg" width={20} height={20} />
            </Styles.AddAddressButton>
          ) : null}
        </Styles.CurrencyHeadingRow>
      </Styles.CurrencyHeading>
      {addresses.length ? (
        <Styles.Addresses>
          {addresses.map((address: string, addressIndex: number) => {
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
                isDisabled={isDisabled}
                onToggle={onToggleSelect(isSelected, symbol, address, addressIndex, isDisabled)}
              />
            )
          })}
          {addresses.length < 100 ? (
            <Styles.NextAddressRow onClick={getAddress}>
              <Styles.NextAddressLabel>Next address</Styles.NextAddressLabel>
              <SVG src="../../assets/icons/bottomArrow.svg" width={7} height={4} />
            </Styles.NextAddressRow>
          ) : null}
        </Styles.Addresses>
      ) : null}
      {isDisconnectError ? (
        <Alert
          type="info"
          text="Ledger is disconnected, you need to reconnect"
          refetchText="Connect again"
          onClick={onReconnect}
        />
      ) : null}
      {isTransportError ? (
        <Alert
          type="danger"
          text={`Failed to get ${symbol} addresses, go to ${symbol} application`}
          refetchText="Try again"
          onClick={getAddress}
        />
      ) : null}
    </Styles.Currency>
  )
}

export default Currency

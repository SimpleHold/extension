import * as React from 'react'
import { render } from 'react-dom'
import TrezorConnect from 'trezor-connect'

// Components
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'
import RadioButton from '@components/RadioButton'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'

// Utils
import { toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'

// Config
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

type TCurrencyAddress = {
  path: number
  address: string
  isDisabled: boolean
}

type TAddress = {
  currency: string
  publicKey: string
  addresses: TCurrencyAddress[]
}

type TCurrency = {
  symbol: string
  path: string
}

const currencies: TCurrency[] = [
  {
    symbol: 'btc',
    path: "m/49'/0'/0'/0/0",
  },
  {
    symbol: 'ltc',
    path: "m/44'/2'/0'/0/0",
  },
  {
    symbol: 'eth',
    path: "m/44'/60'/0'/0/0",
  },
  {
    symbol: 'etc',
    path: "m/44'/10'/0'/0/0",
  },
  {
    symbol: 'xrp',
    path: "m/44'/144'/0'/0/0",
  },
  {
    symbol: 'bch',
    path: "m/44'/145'/0'/0/0",
  },
  {
    symbol: 'dash',
    path: "m/44'/5'/0'/0",
  },
  {
    symbol: 'doge',
    path: "m/44'/3'/0'/0/0",
  },
]

const ConnectTrezor: React.FC = () => {
  const [addresses, setAddresses] = React.useState<TAddress[] | null>(null)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [activeDrawer, setActiveDrawer] = React.useState<'confirm' | 'success' | 'fail' | null>(
    null
  )
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)

  const onConnect = async (): Promise<void> => {
    try {
      setIsLoading(true)

      await TrezorConnect.init({
        manifest: {
          email: 'support@simplehold.io',
          appUrl: 'https://simplehold.io/',
        },
      })

      const { payload } = await TrezorConnect.getPublicKey({
        path: "m/49'/0'/0'/0/0",
        coin: 'btc',
      })

      setIsLoading(false)

      // @ts-ignore
      if (payload?.chainCode && payload?.publicKey) {
        // @ts-ignore
        const { publicKey } = payload
        setAddresses([
          {
            currency: 'btc',
            publicKey,
            addresses: [{ path: 0, address: 'x', isDisabled: false }],
          },
        ])
        // @ts-ignore
      } else if (payload?.error) {
        setIsError(true)
      }
    } catch {
      setIsError(true)
      setIsLoading(false)
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const onTryAgain = (): void => {
    setIsError(false)
  }

  const onConnectCurrency = (coin: string, path: string) => async (): Promise<void> => {
    if (coin === 'ltc') {
      await TrezorConnect.getPublicKey({
        path,
        coin,
      })
    }
  }

  const onClickButton = (): void => {
    if (isError) {
      onTryAgain()
    } else {
      onConnect()
    }
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onConfirmDrawer = (): void => {}

  const onCancel = (): void => {}

  const onConfirm = (): void => {
    setActiveDrawer('confirm')
  }

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <>
        <Styles.Wrapper>
          {isError || !addresses?.length ? (
            <Styles.ErrorRow>
              <Styles.ErrorContentRow>
                <Styles.Image />
                <Styles.ErrorTitle>{isError ? 'Fail' : 'Connect Trezor'}</Styles.ErrorTitle>
                <Styles.ErrorDescription>
                  {isError
                    ? 'Something went wrong, please try again. Please try again. '
                    : 'Follow the instructions on the service page. Follow the instructions'}
                </Styles.ErrorDescription>
              </Styles.ErrorContentRow>
              <Button
                label={isError ? 'Try again' : 'Next'}
                onClick={onClickButton}
                isLoading={isLoading}
              />
            </Styles.ErrorRow>
          ) : null}
          {addresses?.length ? (
            <Styles.Row>
              <Styles.Title>Select wallets</Styles.Title>
              <Styles.Description>
                Select one or more addresses you want to connect. Select one or more addresses you
                want to connect.
              </Styles.Description>
              <Styles.AddressesList>
                {currencies.map((currency: TCurrency) => {
                  const { symbol, path } = currency
                  const currencyInfo = getCurrency(symbol)

                  const getAddresses = addresses.find(
                    (address: TAddress) => address.currency === symbol
                  )

                  return (
                    <Styles.Currency key={symbol} onClick={onConnectCurrency(symbol, path)}>
                      <Styles.CurrencyHeading withCurrencies={getAddresses !== undefined}>
                        <CurrencyLogo symbol={symbol} width={30} height={30} br={10} />
                        <Styles.CurrencyHeadingRow>
                          {currencyInfo ? (
                            <Styles.CurrencyName>{currencyInfo.name}</Styles.CurrencyName>
                          ) : null}
                          {!getAddresses ? (
                            <Styles.CurrencyButton>
                              <Styles.CurrencyButtonTitle>Connect</Styles.CurrencyButtonTitle>
                            </Styles.CurrencyButton>
                          ) : null}
                        </Styles.CurrencyHeadingRow>
                      </Styles.CurrencyHeading>
                      {getAddresses ? (
                        <Styles.CurrencyAddresses>
                          {getAddresses.addresses.map(
                            (currencyAddress: TCurrencyAddress, index: number) => {
                              const { address } = currencyAddress
                              const isLast = index === getAddresses.addresses.length - 1

                              return (
                                <Styles.CurrencyAddress key={`${symbol}/${address}`}>
                                  <Styles.RadioButtonRow>
                                    <RadioButton isActive onToggle={() => null} />
                                  </Styles.RadioButtonRow>
                                  <Styles.CurrencyAddressRow>
                                    <Styles.AddressInfo>
                                      <Styles.Address>{address}</Styles.Address>
                                      <Styles.AddressBalance>
                                        0 {toUpper(symbol)}
                                      </Styles.AddressBalance>
                                    </Styles.AddressInfo>
                                    {isLast ? (
                                      <Styles.CurrencyButton>
                                        <Styles.CurrencyButtonTitle>
                                          More
                                        </Styles.CurrencyButtonTitle>
                                      </Styles.CurrencyButton>
                                    ) : null}
                                  </Styles.CurrencyAddressRow>
                                </Styles.CurrencyAddress>
                              )
                            }
                          )}
                        </Styles.CurrencyAddresses>
                      ) : null}
                    </Styles.Currency>
                  )
                })}
              </Styles.AddressesList>
              <Styles.Actions>
                <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
                <Button label="Confirm" onClick={onConfirm} ml={7.5} />
              </Styles.Actions>
            </Styles.Row>
          ) : null}
        </Styles.Wrapper>
        <ConfirmDrawer
          isActive={activeDrawer === 'confirm'}
          onClose={onCloseDrawer}
          title="Enter the password to restore your wallet"
          textInputValue={password}
          onChangeText={setPassword}
          onConfirm={onConfirmDrawer}
          textInputType="password"
          inputLabel="Enter password"
          isButtonDisabled={!validatePassword(password)}
          inputErrorLabel={passwordErrorLabel}
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

render(<ConnectTrezor />, document.getElementById('connect-trezor'))

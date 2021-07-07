import * as React from 'react'
import { render } from 'react-dom'

// Components
import Button from '@components/Button'
import Currency from './Currency'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Utils
import { toLower } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { getUrl, openWebPage } from '@utils/extension'
import { getItem, setItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { addHardwareWallet } from '@utils/wallet'
import { init, getLabel, getAddresses } from '@utils/trezor'

// Config
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

type TCurrency = {
  symbol: string
  addresses: string[]
}

type TTrezorCurrency = {
  symbol: string
  path: string
  index: number
}

type TTrezorBundle = {
  path: string
  coin: string
  showOnTrezor: boolean
}

type TSelectedAddress = {
  address: string
  symbol: string
  path: string
}

const trezorCurrencies = [
  {
    symbol: 'btc',
    path: "m/49'/0'/0'/0/",
    index: 0,
  },
  {
    symbol: 'ltc',
    path: "m/44'/2'/0'/0/",
    index: 0,
  },
  {
    symbol: 'bch',
    path: "m/44'/145'/0'/0/",
    index: 0,
  },
  {
    symbol: 'dash',
    path: "m/44'/5'/0'/",
    index: 0,
  },
  {
    symbol: 'eth',
    path: "m/44'/60'/0'/0/",
    index: 0,
  },
]

const ConnectTrezor: React.FC = () => {
  const [isError, setIsError] = React.useState<boolean>(false)
  const [currencies, setCurrencies] = React.useState<TCurrency[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [currencyIndexes, setCurrencyIndexex] = React.useState<TTrezorCurrency[]>(trezorCurrencies)
  const [trezorLabel, setTrezorLabel] = React.useState<string>('Trezor')
  const [selectedAddresses, setSelectedAddresses] = React.useState<TSelectedAddress[]>([])
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = async (): Promise<void> => {
    setActiveDrawer('confirm')
  }

  const getTrezorBundle = (symbol: string): TTrezorBundle[] | null => {
    const getCurrency = currencyIndexes.find(
      (currency: TTrezorCurrency) => toLower(currency.symbol) === toLower(symbol)
    )

    if (getCurrency) {
      const { index: currencyIndex, path } = getCurrency

      const data: TTrezorBundle[] = []

      for (const [index] of Array(5).entries()) {
        data.push({
          path: `${path}${index + currencyIndex}`,
          coin: symbol,
          showOnTrezor: false,
        })
      }

      getCurrency.index += 5

      setCurrencyIndexex([...currencyIndexes, getCurrency])

      return data
    }

    return null
  }

  const onConnectTrezor = async (): Promise<void> => {
    try {
      setIsLoading(true)

      await init()

      const label = await getLabel()

      if (label) {
        setTrezorLabel(label)
      }

      await onConnectCurrency('btc')
    } catch {
      setIsError(true)
    }
  }

  const onGetNextAddress = (symbol: string) => (): void => {}

  const onConnectCurrency = async (symbol: string): Promise<void> => {
    const bundle = getTrezorBundle(symbol)

    if (bundle) {
      const addresses = await getAddresses(bundle)

      if (addresses) {
        if (!currencies.length) {
          setCurrencies([
            { symbol: 'btc', addresses },
            { symbol: 'ltc', addresses: [] },
            { symbol: 'bch', addresses: [] },
            { symbol: 'dash', addresses: [] },
            { symbol: 'eth', addresses: [] },
          ])

          setSelectedAddresses([
            {
              symbol: 'btc',
              path: "m/49'/0'/0'/0/0",
              address: addresses[0],
            },
          ])
        } else {
          const getCurrency = currencies.find(
            (currency: TCurrency) => toLower(currency.symbol) === toLower(symbol)
          )

          if (getCurrency) {
            getCurrency.addresses = [...getCurrency.addresses, ...addresses]
            setCurrencies(currencies)
          }
        }
      }
    }
  }

  const onClickButton = (): void => {
    if (isError) {
      setIsError(false)
    } else {
      onConnectTrezor()
    }
  }

  const onToggleSelectAddress = (isSelected: boolean, symbol: string, address: string) => () => {}

  const onDownloadBackup = (): void => {
    openWebPage(getUrl('download-backup.html'))
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onConfirmDrawer = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, password)

      if (decryptBackup) {
        const walletsList = addHardwareWallet(
          'trezor',
          selectedAddresses,
          trezorLabel,
          decryptBackup,
          password
        )

        if (walletsList) {
          setItem('backupStatus', 'notDownloaded')
          return setActiveDrawer('success')
        }
      }
    }

    return setPasswordErrorLabel('Password is not valid')
  }

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <>
        <Styles.Wrapper>
          {!currencies.length || isError ? (
            <Styles.Row pt={40}>
              <Styles.ConnectRow>
                <Styles.Image />
                <Styles.ConnectTitle>{isError ? 'Fail' : 'Connect Trezor'}</Styles.ConnectTitle>
                <Styles.ConnectDescription>
                  {isError
                    ? 'Something went wrong, please try again. Please try again.'
                    : 'Follow the instructions on the service page. Follow the instructions'}
                </Styles.ConnectDescription>
              </Styles.ConnectRow>
              <Button
                label={isError ? 'Try again' : 'Connect'}
                onClick={onClickButton}
                isLoading={isLoading}
              />
            </Styles.Row>
          ) : (
            <Styles.Row pt={30}>
              <Styles.Title>Select wallets</Styles.Title>
              <Styles.Description>
                Select one or more addresses you want to connect. Select one or more addresses you
                want to connect.
              </Styles.Description>

              <Styles.CurrenciesList>
                {currencies.map((currency: TCurrency) => {
                  const { symbol, addresses } = currency
                  const currencyInfo = getCurrency(symbol)

                  return (
                    <Currency
                      key={symbol}
                      symbol={symbol}
                      name={currencyInfo?.name}
                      addresses={addresses}
                      onConnect={onConnectCurrency}
                      onGetNextAddress={onGetNextAddress(symbol)}
                      selectedAddresses={selectedAddresses}
                      onToggleSelect={onToggleSelectAddress}
                    />
                  )
                })}
              </Styles.CurrenciesList>

              <Styles.Actions>
                <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
                <Button label="Confirm" onClick={onConfirm} ml={7.5} />
              </Styles.Actions>
            </Styles.Row>
          )}
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
        <SuccessDrawer
          isActive={activeDrawer === 'success'}
          onClose={onDownloadBackup}
          text="You have successfully added your addresses!"
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

render(<ConnectTrezor />, document.getElementById('connect-trezor'))

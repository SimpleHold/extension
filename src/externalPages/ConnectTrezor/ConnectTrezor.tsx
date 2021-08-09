import * as React from 'react'
import { render } from 'react-dom'
import TrezorConnect, { DEVICE_EVENT } from 'trezor-connect'

// Components
import Button from '@components/Button'
import Currency, { TSelectedAddress } from './Currency'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Utils
import { toLower } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { getUrl, openWebPage } from '@utils/extension'
import { getItem, getJSON, setItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { addHardwareWallet, IWallet } from '@utils/wallet'
import {
  init,
  getAddresses,
  TTrezorBundle,
  currencies as trezorCurrencies,
  TTrezorCurrency,
  getFeatures,
} from '@utils/trezor'

// Assets
import connectTrezorImage from '@assets/illustrate/connectTrezor.svg'
import errorConnectTrezorImage from '@assets/illustrate/errorConnectTrezor.svg'

// Config
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

type TCurrency = {
  symbol: string
  addresses: string[]
}

type TTrezorInfo = {
  device_id: string
  label: string
}

const ConnectTrezor: React.FC = () => {
  const [isError, setIsError] = React.useState<boolean>(false)
  const [currencies, setCurrencies] = React.useState<TCurrency[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [currencyIndexes, setCurrencyIndexex] = React.useState<TTrezorCurrency[]>(trezorCurrencies)
  const [trezorInfo, setTrezorInfo] = React.useState<TTrezorInfo>({
    label: 'Trezor',
    device_id: '-1',
  })
  const [selectedAddresses, setSelectedAddresses] = React.useState<TSelectedAddress[]>([])
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [isTrezorInit, setIsTrezorInit] = React.useState<boolean>(false)
  const [existWallets, setExistWallets] = React.useState<TSelectedAddress[]>([])

  React.useEffect(() => {
    getWalletsList()
  }, [])

  const getWalletsList = (): void => {
    const list: IWallet[] | null = getJSON('wallets')

    if (list?.length) {
      const getTrezorWallets = list.filter((wallet: IWallet) => wallet.hardware?.type === 'trezor')

      if (getTrezorWallets.length) {
        const mapAddresses = getTrezorWallets.map((wallet: IWallet) => {
          return {
            symbol: wallet.symbol,
            address: wallet.address,
            path: wallet.hardware?.path || '0',
          }
        })

        setExistWallets(mapAddresses)
      }
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = (): void => {
    if (trezorInfo.device_id === '-1') {
      return setIsError(true)
    }
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

      const findCurrencyCurrency = currencyIndexes.filter(
        (i: TTrezorCurrency) => toLower(i.symbol) !== toLower(symbol)
      )

      setCurrencyIndexex([...findCurrencyCurrency, getCurrency])

      return data
    }

    return null
  }

  const onConnectTrezor = async (): Promise<void> => {
    try {
      setIsLoading(true)

      if (!isTrezorInit) {
        await init()
        setIsTrezorInit(true)
      }

      const trezorFeatures = await getFeatures()

      if (!trezorFeatures) {
        setIsError(true)
      } else {
        const { device_id, label } = trezorFeatures

        if (device_id && label) {
          setTrezorInfo({
            device_id,
            label,
          })
        }
      }

      const bundle = getTrezorBundle('btc')

      if (bundle) {
        const addresses = await getAddresses(bundle, 'btc')

        setIsLoading(false)

        if (addresses?.length) {
          setCurrencies([
            { symbol: 'btc', addresses },
            { symbol: 'ltc', addresses: [] },
            { symbol: 'bch', addresses: [] },
            { symbol: 'dash', addresses: [] },
            { symbol: 'eth', addresses: [] },
          ])

          const mapAddresses = addresses.map((address: string, index: number) => {
            return {
              address,
              symbol: 'btc',
              path: `m/49'/0'/0'/0/${index}`,
            }
          })

          const findUnusedAddresses = mapAddresses.filter((currency: TSelectedAddress) => {
            const findExist = existWallets.find(
              (wallet: TSelectedAddress) =>
                toLower(wallet.address) === toLower(currency.address) &&
                toLower(wallet.symbol) === toLower(currency.symbol)
            )

            if (!findExist) {
              return currency
            }
          })

          if (findUnusedAddresses.length) {
            setSelectedAddresses([findUnusedAddresses[0]])
          }
        } else {
          setIsLoading(false)
          setIsError(true)
        }
      }
    } catch {
      setIsError(true)
    }
  }

  const onConnectCurrency = async (symbol: string): Promise<void> => {
    const bundle = getTrezorBundle(symbol)

    if (bundle) {
      const addresses = await getAddresses(bundle, symbol)

      if (addresses) {
        const getCurrency = currencies.find(
          (currency: TCurrency) => toLower(currency.symbol) === toLower(symbol)
        )

        if (getCurrency) {
          getCurrency.addresses.push(...addresses)
          setCurrencies([...currencies])
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

  const onToggleSelectAddress = (
    isSelected: boolean,
    symbol: string,
    address: string,
    index: number,
    isDisabled: boolean
  ) => () => {
    if (isDisabled) {
      return
    }

    const getCurrency = currencyIndexes.find(
      (currency: TTrezorCurrency) => toLower(currency.symbol) === toLower(symbol)
    )

    if (getCurrency) {
      const { path } = getCurrency

      if (!isSelected) {
        const newAddress = {
          address,
          symbol,
          path: `${path}${index}`,
        }

        setSelectedAddresses([...selectedAddresses, newAddress])
      } else {
        const removeExist = selectedAddresses.filter(
          (currency: TSelectedAddress) =>
            toLower(currency.address) !== toLower(address) ||
            toLower(currency.symbol) !== toLower(symbol) ||
            toLower(currency.path) !== toLower(`${path}${index}`)
        )

        setSelectedAddresses(removeExist)
      }
    }
  }

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
          trezorInfo.label,
          trezorInfo.device_id,
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
                <Styles.Image src={isError ? errorConnectTrezorImage : connectTrezorImage} />
                <Styles.ConnectTitle>
                  {isError ? 'Connection failed' : 'Connect Trezor'}
                </Styles.ConnectTitle>
                <Styles.ConnectDescription>
                  {isError
                    ? 'Something went wrong. Please reconnect your device and try again.'
                    : 'Connect your Trezor wallet and follow the instructions on the service page.'}
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
                      selectedAddresses={selectedAddresses}
                      onToggleSelect={onToggleSelectAddress}
                      existWallets={existWallets}
                    />
                  )
                })}
              </Styles.CurrenciesList>

              <Styles.Actions>
                <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
                <Button
                  label="Confirm"
                  onClick={onConfirm}
                  ml={7.5}
                  disabled={!selectedAddresses.length}
                />
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

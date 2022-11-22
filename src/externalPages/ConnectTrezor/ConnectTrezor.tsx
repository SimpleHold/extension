import * as React from 'react'
import { render } from 'react-dom'
import browser from 'webextension-polyfill'

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
import { logEvent } from '@utils/metrics'

// Assets
import connectTrezorImage from '@assets/illustrate/connectTrezor.svg'
import errorConnectTrezorImage from '@assets/illustrate/errorConnectTrezor.svg'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'
import { CONNECT_HARDWARE_WALLET } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { TCurrency, TSelectedAddress, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  isError: false,
  currencies: [],
  isLoading: false,
  currencyIndexes: [],
  trezorInfo: {
    label: 'Trezor',
    device_id: '-1',
  },
  selectedAddresses: [],
  activeDrawer: null,
  password: '',
  passwordErrorLabel: null,
  isTrezorInit: false,
  existWallets: [],
}

const ConnectTrezor: React.FC = () => {
  const { state, updateState } = useState({
    ...initialState,
    currencyIndexes: trezorCurrencies,
  })

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

        updateState({ existWallets: mapAddresses })
      }
    }
  }

  const onClose = (): void => {
    window.close()

    logEvent({
      name: CONNECT_HARDWARE_WALLET,
      properties: {
        kind: 'trezor',
        result: 'close',
      },
    })
  }

  const onConfirm = (): void => {
    if (state.trezorInfo.device_id === '-1') {
      return updateState({ isError: true })
    }
    updateState({ activeDrawer: 'confirm' })
  }

  const getTrezorBundle = (symbol: string): TTrezorBundle[] | null => {
    const getCurrency = state.currencyIndexes.find(
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

      const findCurrencyCurrency = state.currencyIndexes.filter(
        (i: TTrezorCurrency) => toLower(i.symbol) !== toLower(symbol)
      )

      updateState({
        currencyIndexes: [...findCurrencyCurrency, getCurrency],
      })

      return data
    }

    return null
  }

  const onConnectTrezor = async (): Promise<void> => {
    try {
      updateState({ isLoading: true })

      if (!state.isTrezorInit) {
        await init()
        updateState({ isTrezorInit: true })
      }

      const trezorFeatures = await getFeatures()

      if (!trezorFeatures) {
        updateState({ isError: true })
      } else {
        const { device_id, label } = trezorFeatures

        if (device_id && label) {
          updateState({
            trezorInfo: {
              device_id,
              label,
            },
          })
        }
      }

      const bundle = getTrezorBundle('btc')

      if (bundle) {
        const addresses = await getAddresses(bundle, 'btc')

        updateState({ isLoading: false })

        if (addresses?.length) {
          updateState({
            currencies: [
              { symbol: 'btc', addresses },
              { symbol: 'ltc', addresses: [] },
              { symbol: 'bch', addresses: [] },
              { symbol: 'dash', addresses: [] },
              { symbol: 'eth', addresses: [] },
            ],
          })

          const mapAddresses = addresses.map((address: string, index: number) => {
            return {
              address,
              symbol: 'btc',
              path: `m/49'/0'/0'/0/${index}`,
            }
          })

          const findUnusedAddresses = mapAddresses.filter((currency: TSelectedAddress) => {
            const findExist = state.existWallets.find(
              (wallet: TSelectedAddress) =>
                toLower(wallet.address) === toLower(currency.address) &&
                toLower(wallet.symbol) === toLower(currency.symbol)
            )

            if (!findExist) {
              return currency
            }
          })

          logEvent({
            name: CONNECT_HARDWARE_WALLET,
            properties: {
              kind: 'trezor',
              result: 'success',
            },
          })

          if (findUnusedAddresses.length) {
            updateState({ selectedAddresses: [findUnusedAddresses[0]] })
          }
        } else {
          updateState({ isLoading: false })
          updateState({ isError: true })
        }
      }
    } catch {
      updateState({ isError: true })
    }
  }

  const onConnectCurrency = async (symbol: string): Promise<void> => {
    const bundle = getTrezorBundle(symbol)

    if (bundle) {
      const addresses = await getAddresses(bundle, symbol)

      if (addresses) {
        const getCurrency = state.currencies.find(
          (currency: TCurrency) => toLower(currency.symbol) === toLower(symbol)
        )

        if (getCurrency) {
          getCurrency.addresses.push(...addresses)
          updateState({ currencies: [...state.currencies] })
        }
      }
    }
  }

  const onClickButton = (): void => {
    if (state.isError) {
      updateState({ isError: false })
    } else {
      onConnectTrezor()
    }
  }

  const onToggleSelectAddress =
    (isSelected: boolean, symbol: string, address: string, index: number, isDisabled: boolean) =>
    () => {
      if (isDisabled) {
        return
      }

      const getCurrency = state.currencyIndexes.find(
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

          updateState({ selectedAddresses: [...state.selectedAddresses, newAddress] })
        } else {
          const removeExist = state.selectedAddresses.filter(
            (currency: TSelectedAddress) =>
              toLower(currency.address) !== toLower(address) ||
              toLower(currency.symbol) !== toLower(symbol) ||
              toLower(currency.path) !== toLower(`${path}${index}`)
          )

          updateState({ selectedAddresses: removeExist })
        }
      }
    }

  const onDownloadBackup = (): void => {
    openWebPage(getUrl('download-backup.html'))
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onConfirmDrawer = (): void => {
    if (state.passwordErrorLabel) {
      updateState({ passwordErrorLabel: null })
    }

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, state.password)

      if (decryptBackup) {
        const walletsList = addHardwareWallet(
          'trezor',
          state.selectedAddresses,
          state.trezorInfo.label,
          state.trezorInfo.device_id,
          decryptBackup,
          state.password
        )

        if (walletsList) {
          setItem('backupStatus', 'notDownloaded')
          return updateState({ activeDrawer: 'success' })
        }
      }
    }

    updateState({ passwordErrorLabel: 'Password is not valid' })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <>
        <Styles.Wrapper>
          {!state.currencies.length || state.isError ? (
            <Styles.Row pt={40}>
              <Styles.ConnectRow>
                <Styles.Image src={state.isError ? errorConnectTrezorImage : connectTrezorImage} />
                <Styles.ConnectTitle>
                  {state.isError ? 'Connection failed' : 'Connect Trezor'}
                </Styles.ConnectTitle>
                <Styles.ConnectDescription>
                  {state.isError
                    ? 'Something went wrong. Please reconnect your device and try again.'
                    : 'Connect your Trezor wallet and follow the instructions on the service page.'}
                </Styles.ConnectDescription>
              </Styles.ConnectRow>
              <Button
                label={state.isError ? 'Try again' : 'Connect'}
                onClick={onClickButton}
                isLoading={state.isLoading}
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
                {state.currencies.map((currency: TCurrency) => {
                  const { symbol, addresses } = currency
                  const currencyInfo = getCurrencyInfo(symbol)

                  return (
                    <Currency
                      key={symbol}
                      symbol={symbol}
                      name={currencyInfo?.name}
                      addresses={addresses}
                      onConnect={onConnectCurrency}
                      selectedAddresses={state.selectedAddresses}
                      onToggleSelect={onToggleSelectAddress}
                      existWallets={state.existWallets}
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
                  disabled={!state.selectedAddresses.length}
                />
              </Styles.Actions>
            </Styles.Row>
          )}
        </Styles.Wrapper>

        <ConfirmDrawer
          isActive={state.activeDrawer === 'confirm'}
          onClose={onCloseDrawer}
          title="Enter the password to restore your wallet"
          textInputValue={state.password}
          onChangeText={setPassword}
          onConfirm={onConfirmDrawer}
          textInputType="password"
          inputLabel="Enter password"
          isButtonDisabled={!validatePassword(state.password)}
          inputErrorLabel={state.passwordErrorLabel}
          openFrom="browser"
        />
        <SuccessDrawer
          isActive={state.activeDrawer === 'success'}
          onClose={onDownloadBackup}
          text="You have successfully added your addresses!"
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  render(<ConnectTrezor />, document.getElementById('connect-trezor'))
})

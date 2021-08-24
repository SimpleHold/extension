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
import { requestTransport, currencies, TCurrency } from '@utils/ledger'
import { validatePassword } from '@utils/validate'
import { getUrl, openWebPage } from '@utils/extension'
import { getItem, getJSON, setItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { addHardwareWallet, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Hooks
import useState from '@hooks/useState'

// Types
import { TSelectedAddress, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  ledgerTransport: null,
  ledgerName: 'Ledger',
  activeDrawer: null,
  password: '',
  passwordErrorLabel: null,
  selectedAddresses: [],
  existWallets: [],
  firstAddresses: [],
}

const ConnectLedger: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  const getWalletsList = (): void => {
    const list: IWallet[] | null = getJSON('wallets')

    if (list?.length) {
      const getLedgerWallets = list.filter((wallet: IWallet) => wallet.hardware?.type === 'ledger')

      if (getLedgerWallets.length) {
        const mapAddresses = getLedgerWallets.map((wallet: IWallet) => {
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
  }

  const onConnect = async () => {
    const ledgerTransport = await requestTransport()

    if (ledgerTransport) {
      updateState({ ledgerTransport })

      const ledgerName = ledgerTransport.deviceModel?.productName

      if (ledgerName) {
        updateState({ ledgerName })
      }
    }
  }

  const onConfirm = (): void => {
    updateState({ activeDrawer: 'confirm' })
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
          'ledger',
          state.selectedAddresses,
          state.ledgerName,
          'ledger',
          decryptBackup,
          state.password,
          state.firstAddresses
        )

        if (walletsList) {
          setItem('backupStatus', 'notDownloaded')
          updateState({ activeDrawer: 'success' })
          return
        }
      }
    }

    updateState({ passwordErrorLabel: 'Password is not valid' })
  }

  const onDownloadBackup = (): void => {
    openWebPage(getUrl('download-backup.html'))
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

    const getCurrency = currencies.find(
      (currency: TCurrency) => toLower(currency.symbol) === toLower(symbol)
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

  const saveFirstAddress = (symbol: string, address: string) => {
    updateState({ firstAddresses: [...state.firstAddresses, { symbol, address }] })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const renderConnect = () => (
    <Styles.Container pt={40}>
      <Styles.Row>
        <Styles.ConnectImage />
        <Styles.Title>Connect ledger</Styles.Title>
        <Styles.Description>
          Connect your Ledger and follow the instructions on the service popup
        </Styles.Description>
      </Styles.Row>
      <Button label="Connect" onClick={onConnect} />
    </Styles.Container>
  )

  const renderWallets = () => (
    <Styles.Container pt={30}>
      <Styles.Row>
        <Styles.WalletsTitle>Select wallets</Styles.WalletsTitle>
        <Styles.WalletsDescription>
          Select one or more addresses you want to connect. Select one or more addresses you want to
          connect.
        </Styles.WalletsDescription>

        {state.ledgerTransport ? (
          <Styles.WalletsList>
            {currencies.map((currency: TCurrency) => {
              const { symbol } = currency

              if (state.ledgerTransport) {
                return (
                  <Currency
                    key={symbol}
                    symbol={symbol}
                    transport={state.ledgerTransport}
                    selectedAddresses={state.selectedAddresses}
                    existWallets={state.existWallets}
                    onToggleSelect={onToggleSelectAddress}
                    saveFirstAddress={saveFirstAddress}
                  />
                )
              }

              return null
            })}
          </Styles.WalletsList>
        ) : null}
      </Styles.Row>
      <Styles.Actions>
        <Button label="Cancel" onClick={onClose} isLight mr={7.5} />
        <Button
          label="Confirm"
          onClick={onConfirm}
          disabled={!state.selectedAddresses.length}
          mr={7.5}
        />
      </Styles.Actions>
    </Styles.Container>
  )

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <>
        <Styles.Wrapper>{state.ledgerTransport ? renderWallets() : renderConnect()}</Styles.Wrapper>
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

render(<ConnectLedger />, document.getElementById('connect-ledger'))

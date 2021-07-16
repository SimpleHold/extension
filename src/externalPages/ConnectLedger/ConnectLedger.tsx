import * as React from 'react'
import { render } from 'react-dom'
import type Transport from '@ledgerhq/hw-transport-webusb'

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

// Styles
import Styles from './styles'

type TSelectedAddress = {
  address: string
  path: string
  symbol: string
}

const ConnectLedger: React.FC = () => {
  const [ledgerTransport, setLedgerTransport] = React.useState<Transport | null>(null)
  const [ledgerName, setLedgerName] = React.useState<string>('Ledger')
  const [productId, setProductId] = React.useState<string>('-1')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [selectedAddresses, setSelectedAddresses] = React.useState<TSelectedAddress[]>([])
  const [existWallets, setExistWallets] = React.useState<TSelectedAddress[]>([])

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

        setExistWallets(mapAddresses)
      }
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const onConnect = async () => {
    const transport = await requestTransport()

    if (transport) {
      setLedgerTransport(transport)

      const getProductName = transport.deviceModel?.productName
      const getProductId = transport?.device?.productId

      if (getProductName) {
        setLedgerName(getProductName)
      }

      if (getProductId) {
        setProductId(`${getProductId}`)
      }
    }
  }

  const onConfirm = (): void => {
    setActiveDrawer('confirm')
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
          'ledger',
          selectedAddresses,
          ledgerName,
          productId,
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

  const onDownloadBackup = (): void => {
    openWebPage(getUrl('download-backup.html'))
  }

  const onToggleSelectAddress = (
    isSelected: boolean,
    symbol: string,
    address: string,
    index: number
  ) => () => {
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

  const renderConnect = () => (
    <Styles.Container pt={40}>
      <Styles.Row>
        <Styles.ConnectImage />
        <Styles.Title>Connect ledger</Styles.Title>
        <Styles.Description>
          Follow the instructions on the service page. Follow the instructions
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

        {ledgerTransport ? (
          <Styles.WalletsList>
            {currencies.map((currency: TCurrency) => {
              const { symbol } = currency

              return (
                <Currency
                  key={symbol}
                  symbol={symbol}
                  transport={ledgerTransport}
                  selectedAddresses={selectedAddresses}
                  existWallets={existWallets}
                  onToggleSelect={onToggleSelectAddress}
                />
              )
            })}
          </Styles.WalletsList>
        ) : null}
      </Styles.Row>
      <Styles.Actions>
        <Button label="Cancel" onClick={onClose} isLight mr={7.5} />
        <Button label="Confirm" onClick={onConfirm} disabled={!selectedAddresses.length} mr={7.5} />
      </Styles.Actions>
    </Styles.Container>
  )

  return (
    <ExternalPageContainer onClose={onClose} height="100%" headerStyle="white">
      <>
        <Styles.Wrapper>{ledgerTransport ? renderWallets() : renderConnect()}</Styles.Wrapper>
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

render(<ConnectLedger />, document.getElementById('connect-ledger'))

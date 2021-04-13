import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { v4 } from 'uuid'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrenciesDropdown from 'components/CurrenciesDropdown'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { toUpper, toLower } from '@utils/format'
import { getWallets, IWallet, addNew as addNewWallet } from '@utils/wallet'
import { validatePassword } from '@utils/validate'
import { decrypt, encrypt } from '@utils/crypto'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  platform: string
}

const AddTokenToAddress: React.FC = () => {
  const history = useHistory()
  const {
    state: { symbol, platform },
  } = useLocation<LocationState>()

  const [platformAddresses, setPlatformAddresses] = React.useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  React.useEffect(() => {
    getPlatformAddresses()
  }, [])

  React.useEffect(() => {
    if (platformAddresses.length && !selectedAddress.length) {
      setSelectedAddress(platformAddresses[0])
    }
  }, [platformAddresses, selectedAddress])

  const getPlatformAddresses = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallets = walletsList
        .filter((wallet: IWallet) => toLower(wallet.symbol) === toLower(platform))
        .map((wallet: IWallet) => wallet.address)

      setPlatformAddresses(filterWallets)
    }
  }

  const onSkip = (): void => {
    history.push('/new-wallet', {
      symbol,
      warning:
        'You are trying to add new ERC20 token address. Corresponding Ethereum address will also be added to your wallet',
      backTitle: `Add to ${toUpper(platform)} address`,
      platform,
    })
  }

  const onConfirm = (): void => {
    setActiveDrawer('confirm')
  }

  const onConfirmDrawer = (): void => {
    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => (wallet.address = selectedAddress)
          )

          const uuid = v4()
          const newWalletsList = addNewWallet(selectedAddress, symbol, uuid, platform)

          parseBackup.wallets.push({
            symbol,
            selectedAddress,
            uuid,
            privateKey: findWallet.privateKey,
          })

          if (newWalletsList) {
            localStorage.setItem('backup', encrypt(JSON.stringify(parseBackup), password))
            localStorage.setItem('wallets', newWalletsList)
            localStorage.setItem('backupStatus', 'notDownloaded')

            history.push('/download-backup', {
              password,
              from: 'addTokenToAddress',
            })
          }
        }
      }
    }
    return setErrorLabel('Password is not valid')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Select currency" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Add to {toUpper(platform)} address</Styles.Title>
            <Styles.Description>
              You are trying to add new ERC20 token address. Do you want to associate one of your
              Ethereum address with Tether? Press Skip if you want to add new address
            </Styles.Description>

            <CurrenciesDropdown
              currencySymbol={platform}
              list={[
                {
                  logo: {
                    // Fix me
                    symbol: 'eth',
                    width: 40,
                    height: 40,
                    br: 20,
                    background: '#1D1D22',
                  },
                  value: '0x4ef3e1eb84b17a5582461285b5ebf32a6538f610',
                },
              ]}
              onSelect={setSelectedAddress}
              label="Select address"
              value={selectedAddress}
              disabled={platformAddresses.length < 2}
            />
          </Styles.Row>

          <Styles.Actions>
            <Button label="Skip" isLight isSmall mr={7.5} onClick={onSkip} />
            <Button label="Confirm" isSmall ml={7.5} onClick={onConfirm} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
    </>
  )
}

export default AddTokenToAddress

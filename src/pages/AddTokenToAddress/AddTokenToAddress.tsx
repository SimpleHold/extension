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

// Config
import { getUnusedAddressesForToken } from '@config/tokens'
import { getCurrencyByChain } from '@config/currencies'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  chain: string
  chainName: string
  tokenName: string
  contractAddress: string
}

const AddTokenToAddress: React.FC = () => {
  const history = useHistory()
  const {
    state: { symbol, chain, chainName, tokenName, contractAddress },
  } = useLocation<LocationState>()

  const getCurrencyInfo = getCurrencyByChain(chain)

  const [chainAddresses, setChainAddresses] = React.useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const mapList = chainAddresses
    .filter((address: string) => toLower(address) !== toLower(selectedAddress))
    .map((address: string) => {
      return {
        logo: {
          symbol: getCurrencyInfo?.symbol || chain,
          width: 40,
          height: 40,
          br: 20,
          background: '#1D1D22',
        },
        value: address,
      }
    })

  React.useEffect(() => {
    getChainAddresses()
  }, [])

  React.useEffect(() => {
    if (chainAddresses.length && !selectedAddress.length) {
      setSelectedAddress(chainAddresses[0])
    }
  }, [chainAddresses, selectedAddress])

  const getChainAddresses = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const addresses = getUnusedAddressesForToken(walletsList, symbol, chain)
      setChainAddresses(addresses)
    }
  }

  const onSkip = (): void => {
    history.push('/new-wallet', {
      symbol,
      warning:
        'You are trying to add new ERC20 token address. Corresponding Ethereum address will also be added to your wallet',
      backTitle: `Add to ${toUpper(chain)} address`,
      chain,
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
            (wallet: IWallet) => wallet.address === selectedAddress
          )

          const uuid = v4()
          const newWalletsList = addNewWallet(
            selectedAddress,
            symbol,
            uuid,
            chain,
            tokenName,
            contractAddress
          )

          parseBackup.wallets.push({
            symbol,
            address: selectedAddress,
            uuid,
            privateKey: findWallet.privateKey,
            chain,
            tokenName,
            contractAddress,
          })

          if (newWalletsList) {
            localStorage.setItem('backup', encrypt(JSON.stringify(parseBackup), password))
            localStorage.setItem('wallets', newWalletsList)
            localStorage.setItem('backupStatus', 'notDownloaded')

            history.replace('/download-backup', {
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
            <Styles.Title>Add to {toUpper(chain)} address</Styles.Title>
            <Styles.Description>
              You are trying to add new ERC20 token address. Do you want to associate one of your{' '}
              {chainName} address with {tokenName}? Press Skip if you want to add new address
            </Styles.Description>

            <CurrenciesDropdown
              label="Select address"
              value={selectedAddress}
              currencySymbol={getCurrencyInfo?.symbol || chain}
              list={mapList}
              onSelect={setSelectedAddress}
              disabled={chainAddresses.length < 2}
              currencyBr={20}
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

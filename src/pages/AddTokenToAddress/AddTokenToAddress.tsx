import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrenciesDropdown from '@components/CurrenciesDropdown'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { toUpper, toLower } from '@utils/format'
import { getWallets, IWallet, addNew as addNewWallet } from '@utils/wallet'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { getItem, setItem } from '@utils/storage'

// Config
import { getUnusedAddressesForToken } from '@config/tokens'
import { getCurrencyByChain } from '@config/currencies'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  chainAddresses: [],
  selectedAddress: '',
  activeDrawer: null,
  password: '',
  errorLabel: null,
}

const AddTokenToAddress: React.FC = () => {
  const history = useHistory()
  const {
    state: {
      symbol,
      chain,
      chainName,
      tokenName,
      tokenStandart,
      contractAddress = undefined,
      decimals = undefined,
    },
  } = useLocation<ILocationState>()

  const { state, updateState } = useState<IState>(initialState)

  const getCurrencyInfo = getCurrencyByChain(chain)

  const mapList = state.chainAddresses
    .filter((address: string) => toLower(address) !== toLower(state.selectedAddress))
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
    if (state.chainAddresses.length && !state.selectedAddress.length) {
      updateState({ selectedAddress: state.chainAddresses[0] })
    }
  }, [state.chainAddresses, state.selectedAddress])

  const getChainAddresses = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const chainAddresses = getUnusedAddressesForToken(walletsList, symbol, chain)
      updateState({ chainAddresses })
    }
  }

  const onSkip = (): void => {
    history.push('/new-wallet', {
      symbol,
      warning: `You are trying to add a new ${tokenStandart} token address. The corresponding ${chainName} address will also be added to your wallet.`,
      backTitle: `Add to ${toUpper(chain)} address`,
      chain,
      tokenName,
      contractAddress,
      decimals,
    })
  }

  const onConfirm = (): void => {
    updateState({ activeDrawer: 'confirm' })
  }

  const onSelectDropdown = (index: number): void => {
    updateState({ selectedAddress: mapList[index].value })
  }

  const onConfirmDrawer = (): void => {
    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, state.password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => wallet.address === state.selectedAddress
          )

          if (findWallet) {
            const walletsList = addNewWallet(
              state.selectedAddress,
              findWallet.privateKey,
              decryptBackup,
              state.password,
              [symbol],
              false,
              chain,
              tokenName,
              contractAddress,
              decimals
            )

            if (walletsList) {
              setItem('backupStatus', 'notDownloaded')

              history.replace('/download-backup', {
                password: state.password,
                from: 'addTokenToAddress',
              })
            }
          }
        }
      }
    }
    updateState({ errorLabel: 'Password is not valid' })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Select currency" whiteLogo/>
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Add to {toUpper(chain)} address</Styles.Title>
            <Styles.Description>
              You are trying to add a new {tokenStandart} token address. Do you want to use one of
              your current {chainName} addresses with {tokenName}? Skip it if you want to add the
              new address.
            </Styles.Description>

            <CurrenciesDropdown
              label="Select address"
              value={state.selectedAddress}
              currencySymbol={getCurrencyInfo?.symbol || chain}
              list={mapList}
              onSelect={onSelectDropdown}
              disabled={state.chainAddresses.length < 2}
              currencyBr={20}
            />
          </Styles.Row>

          <Styles.Actions>
            <Button label="Skip" isLight mr={7.5} onClick={onSkip} />
            <Button
              label="Confirm"
              disabled={!state.chainAddresses.length}
              ml={7.5}
              onClick={onConfirm}
            />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Please enter your password to add a new address"
        inputLabel="Enter password"
        textInputValue={state.password}
        isButtonDisabled={!validatePassword(state.password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={state.errorLabel}
      />
    </>
  )
}

export default AddTokenToAddress

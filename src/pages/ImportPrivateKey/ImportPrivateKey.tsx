import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Utils
import { validatePassword } from '@utils/validate'
import {
  checkExistWallet,
  addNew as addNewWallet,
  IWallet,
  getWallets,
} from '@utils/wallet'
import { decrypt } from '@utils/crypto'
import { setUserProperties } from '@utils/amplitude'
import { toLower, toUpper } from '@utils/format'
import { importPrivateKey, getTokenStandard } from '@utils/currencies'
import { getTokensBalance } from '@utils/api'
import { getItem, setItem } from '@utils/storage'
import * as theta from '@utils/currencies/theta'
import * as vechain from '@utils/currencies/vechain'

// Hooks
import useState from '@hooks/useState'

// Config
import tokens, { IToken } from '@config/tokens'
import { getCurrencyByChain, ICurrency } from '@config/currencies'

// Types
import { IState, LocationState } from './types'
import { ITokensBalance } from '@utils/api/types'

// Styles
import Styles from './styles'

const initialState: IState = {
  privateKey: '',
  activeDrawer: null,
  errorLabel: null,
  password: '',
  isImportButtonLoading: false,
}

const ImportPrivateKey: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)

  const history = useHistory()
  const {
    state: {
      symbol,
      chain = undefined,
      tokenName = undefined,
      contractAddress = undefined,
      decimals = undefined,
    },
  } = useLocation<LocationState>()

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    textInputRef.current?.focus()
  }, [])

  const onConfirm = async (isSkipFindTokens?: boolean): Promise<void> => {
    if (state.errorLabel) {
      updateState({ errorLabel: null })
    }

    if (symbol === 'hbar') {
      updateState({ isImportButtonLoading: true })
    }

    const getAddress = await importPrivateKey(symbol, state.privateKey, chain)

    if (symbol === 'hbar') {
      updateState({ isImportButtonLoading: false })
    }

    if (getAddress) {
      const checkExist = checkExistWallet(getAddress, symbol, chain)

      if (checkExist) {
        return updateState({ errorLabel: 'This address has already been added' })
      }

      if (chain && !isSkipFindTokens) {
        return await findAddressTokens(getAddress, state.privateKey)
      }

      return updateState({ activeDrawer: 'confirm' })
    }

    return updateState({ errorLabel: 'Invalid private key' })
  }

  const findAddressTokens = async (address: string, privateKey: string): Promise<void> => {
    if (chain) {
      updateState({ isImportButtonLoading: true })

      const data = await getTokensBalance(address, chain)
      const filterData = data?.filter((item) => toLower(item.symbol) !== toLower(symbol))

      updateState({ isImportButtonLoading: false })
      const wallets = getWallets()

      if (filterData?.length && wallets) {
        const mapTokens = filterData.map((token: ITokensBalance) => token.symbol)
        const mapExistTokens = tokens.map((token: IToken) => token.symbol)
        const filterByExistTokens = mapTokens.filter((token: string) =>
          mapExistTokens.includes(token)
        )
        const mapWalletsExistTokens = wallets
          .filter(
            (wallet: IWallet) =>
              toLower(wallet.chain) === toLower(chain) &&
              filterByExistTokens.includes(wallet.symbol)
          )
          .map((wallet: IWallet) => wallet.symbol)
        const removeDuplicates = filterByExistTokens.filter(
          (i) => !mapWalletsExistTokens.includes(i)
        )

        if (removeDuplicates.length) {
          return history.push('/found-tokens', {
            chain,
            symbol: toLower(symbol),
            privateKey,
            tokens: removeDuplicates,
            tokenName,
            contractAddress,
            decimals,
            tokenStandart: getTokenStandard(toLower(chain)),
          })
        }
      }

      return onConfirm(true)
    }
  }

  const getCurrenciesList = (getCurrencyInfo?: ICurrency | undefined | null): string[] => {
    if (vechain.coins.indexOf(symbol) !== -1) {
      return vechain.coins.sort((a: string, b: string) => b.indexOf(symbol) - a.indexOf(symbol))
    }
    if (theta.coins.indexOf(symbol) !== -1) {
      return theta.coins.sort((a: string, b: string) => a.indexOf(symbol) - b.indexOf(symbol))
    }
    if (chain && getCurrencyInfo) {
      return [symbol, getCurrencyInfo.symbol]
    }
    return [symbol]
  }

  const onConfirmDrawer = async (): Promise<void> => {
    const backup = getItem('backup')

    if (backup && state.privateKey) {
      const decryptBackup = decrypt(backup, state.password)
      if (decryptBackup) {
        const address = await importPrivateKey(symbol, state.privateKey, chain)

        if (address) {
          const getCurrencyInfo = chain ? getCurrencyByChain(chain) : null
          const currenciesList = getCurrenciesList(getCurrencyInfo)

          const walletsList = addNewWallet(
            address,
            state.privateKey,
            decryptBackup,
            state.password,
            currenciesList,
            false,
            chain,
            tokenName,
            contractAddress,
            decimals,
          )

          if (walletsList) {
            setItem('backupStatus', 'notDownloaded')

            const walletAmount = JSON.parse(walletsList).filter(
              (wallet: IWallet) => wallet.symbol === symbol
            ).length
            setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

            return updateState({ activeDrawer: 'success' })
          }
        }
      }
    }

    return updateState({ errorLabel: 'Password is not valid' })
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password: state.password,
      from: 'privateKey',
    })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setPrivateKey = (privateKey: string): void => {
    updateState({ privateKey })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Add address" whiteLogo/>
        <Styles.Container>
          <Styles.Heading>
            <Styles.Title>Import a private key</Styles.Title>
            <Styles.Description>
              Use your existing address to receive and send crypto. Just enter a private key of this
              address to import it into SimpleHold.
            </Styles.Description>
            <Link
              to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
              title="How it works?"
              mt={30}
            />
          </Styles.Heading>
          <Styles.Form>
            <TextInput
              label="Enter key"
              value={state.privateKey}
              onChange={setPrivateKey}
              errorLabel={state.errorLabel}
              inputRef={textInputRef}
              type="text"
            />
            <Styles.Actions>
              <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
              <Button
                label="Import"
                disabled={!state.privateKey.length}
                onClick={onConfirm}
                ml={7.5}
                isLoading={state.isImportButtonLoading}
              />
            </Styles.Actions>
          </Styles.Form>
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
      <SuccessDrawer
        isActive={state.activeDrawer === 'success'}
        onClose={onDownloadBackup}
        text="The new address has been successfully added!"
      />
    </>
  )
}

export default ImportPrivateKey

import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import CurrencyLogo from '@components/CurrencyLogo'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Config
import tokens, { IToken } from '@config/tokens'

// Utils
import { toUpper, toLower } from '@utils/format'
import { addNew as addNewWallet, getWallets, IWallet } from '@utils/wallet'
import { setUserProperties } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { getItem, setItem } from '@utils/storage'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'
import { getTokens } from 'utils/localTokens'

const initialState: IState = {
  searchValue: '',
  activeDrawer: null,
  password: '',
  errorLabel: null,
  tokenSymbol: '',
  tokensList: [],
}

const SelectToken: React.FC = () => {
  const history = useHistory()
  const {
    state: { address, currency },
  } = useLocation<ILocationState>()

  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    getTokensList()
  }, [])

  React.useEffect(() => {
    checkLocalTokens()
  }, [])

  const checkLocalTokens = (): void => {
    const localTokens = getTokens()

    if (localTokens.length) {
      updateState({ tokensList: [...state.tokensList, ...localTokens] })
    }
  }

  const getTokensList = (): void => {
    const wallets = getWallets()

    if (wallets) {
      const getExistTokens: string[] = wallets
        .filter(
          (wallet: IWallet) =>
            toLower(wallet.address) === toLower(address) &&
            toLower(wallet.chain) === toLower(currency.chain)
        )
        .map((wallet: IWallet) => wallet.symbol)
      const tokensList: IToken[] = tokens.filter(
        (token: IToken) =>
          toLower(token.chain) === toLower(currency.chain) && !getExistTokens.includes(token.symbol)
      )

      updateState({ tokensList })
    }
  }

  const filterTokensList = state.tokensList.filter((token: IToken) => {
    if (state.searchValue.length) {
      const findByName = toLower(token.name)?.indexOf(toLower(state.searchValue) || '') !== -1
      const findBySymbol = toLower(token.symbol)?.indexOf(toLower(state.searchValue) || '') !== -1

      return findByName || findBySymbol
    }
    return token
  })

  const onAddCustomToken = (): void => {
    history.push('/add-custom-token', {
      activeNetwork: currency.chain,
      currency,
      address,
    })
  }

  const onAddToken = (tokenSymbol: string): void => {
    updateState({ activeDrawer: 'confirm', tokenSymbol })
  }

  const onConfirm = (): void => {
    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, state.password)
        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => wallet.address === address
          )

          if (findWallet) {
            const walletsList = addNewWallet(
              address,
              findWallet.privateKey,
              decryptBackup,
              state.password,
              [state.tokenSymbol],
              false,
              currency.chain
            )

            if (walletsList) {
              const walletAmount = JSON.parse(walletsList).filter(
                (wallet: IWallet) => wallet.symbol === state.tokenSymbol
              ).length
              setUserProperties({
                [`NUMBER_WALLET_${toUpper(state.tokenSymbol)}`]: `${walletAmount}`,
              })

              setItem('backupStatus', 'notDownloaded')

              return history.replace('/download-backup', {
                password: state.password,
                from: 'selectToken',
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

  const setSearchValue = (searchValue: string): void => {
    updateState({ searchValue })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Receive" whiteLogo />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Select token</Styles.Title>

            <TextInput
              value={state.searchValue}
              label="Type a currency or ticker"
              onChange={setSearchValue}
              type="text"
            />

            {!filterTokensList.length && state.tokensList.length ? (
              <Styles.NotFoundMessage>
                Currency was not found but you can add custom token
              </Styles.NotFoundMessage>
            ) : null}

            <Styles.TokensList>
              {filterTokensList.map((token: IToken) => {
                const { name, symbol, chain } = token

                return (
                  <Styles.TokenBlock key={symbol} onClick={() => onAddToken(symbol)}>
                    <CurrencyLogo symbol={symbol} size={40} br={10} chain={chain} />
                    <Styles.TokenName>{name}</Styles.TokenName>
                    <Styles.TokenSymbol>{toUpper(symbol)}</Styles.TokenSymbol>
                  </Styles.TokenBlock>
                )
              })}

              <Styles.TokenBlock onClick={onAddCustomToken}>
                <Styles.CustomTokenLogo>
                  <SVG
                    src="../../assets/icons/plusCircle.svg"
                    width={20}
                    height={20}
                    title="Create new wallet"
                  />
                </Styles.CustomTokenLogo>
                <Styles.CustomTokenLabel>Add Custom Token</Styles.CustomTokenLabel>
              </Styles.TokenBlock>
            </Styles.TokensList>
          </Styles.Row>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={state.password}
        isButtonDisabled={!validatePassword(state.password)}
        onConfirm={onConfirm}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={state.errorLabel}
      />
    </>
  )
}

export default SelectToken

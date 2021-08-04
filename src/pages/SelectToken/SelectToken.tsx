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
import { ICurrency } from '@config/currencies'

// Utils
import { toUpper, toLower } from '@utils/format'
import { addNew as addNewWallet, getWallets, IWallet } from '@utils/wallet'
import { setUserProperties } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { getItem, setItem } from '@utils/storage'

// Styles
import Styles from './styles'

interface LocationState {
  address: string
  currency: ICurrency
}

const SelectToken: React.FC = () => {
  const history = useHistory()
  const {
    state: { address, currency },
  } = useLocation<LocationState>()

  const [searchValue, setSearchValue] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [tokenSymbol, setTokenSymbol] = React.useState<string>('')
  const [tokensList, setTokensList] = React.useState<IToken[]>([])

  React.useEffect(() => {
    getTokensList()
  }, [])

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
      const removeExistTokens: IToken[] = tokens.filter(
        (token: IToken) =>
          toLower(token.chain) === toLower(currency.chain) && !getExistTokens.includes(token.symbol)
      )

      setTokensList(removeExistTokens)
    }
  }

  const filterTokensList = tokensList.filter((token: IToken) => {
    if (searchValue.length) {
      const findByName = toLower(token.name)?.indexOf(toLower(searchValue) || '') !== -1
      const findBySymbol = toLower(token.symbol)?.indexOf(toLower(searchValue) || '') !== -1

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

  const onAddToken = (symbol: string): void => {
    setActiveDrawer('confirm')
    setTokenSymbol(symbol)
  }

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, password)
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
              password,
              [tokenSymbol],
              false,
              currency.chain
            )

            if (walletsList) {
              const walletAmount = JSON.parse(walletsList).filter(
                (wallet: IWallet) => wallet.symbol === tokenSymbol
              ).length
              setUserProperties({ [`NUMBER_WALLET_${toUpper(tokenSymbol)}`]: `${walletAmount}` })

              setItem('backupStatus', 'notDownloaded')

              return history.replace('/download-backup', {
                password,
                from: 'selectToken',
              })
            }
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
        <Header withBack onBack={history.goBack} backTitle="Receive" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Select token</Styles.Title>

            <TextInput
              value={searchValue}
              label="Type a currency or ticker"
              onChange={setSearchValue}
              type="text"
            />

            {!filterTokensList.length && tokensList.length ? (
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
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirm}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
    </>
  )
}

export default SelectToken

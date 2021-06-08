import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Warning from '@components/Warning'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Utils
import { logEvent, setUserProperties } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { addNew as addNewWallet, IWallet } from '@utils/wallet'
import { toUpper } from '@utils/format'
import { generate, importPrivateKey, importRecoveryPhrase } from '@utils/address'
import * as theta from '@utils/currencies/theta'
import { getItem, setItem } from '@utils/storage'

// Config
import { ADD_ADDRESS_GENERATE, ADD_ADDRESS_IMPORT, ADD_ADDRESS_CONFIRM } from '@config/events'
import { getCurrencyByChain, ICurrency, checkWithPhrase } from '@config/currencies'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: TSymbols
  warning?: string
  backTitle?: string
  chain?: string
  tokenName?: string
  contractAddress?: string
  decimals?: number
}

const NewWallet: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [mnemonic, setMnemonic] = React.useState<null | string>(null)

  const history = useHistory()
  const {
    state: {
      symbol,
      warning = undefined,
      backTitle = undefined,
      chain = undefined,
      tokenName = undefined,
      contractAddress = undefined,
      decimals = undefined,
    },
  } = useLocation<LocationState>()

  const onGenerateAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS_GENERATE,
    })

    const generateAddress = generate(symbol, chain)

    if (generateAddress) {
      const { privateKey: walletPrivateKey, mnemonic: walletMnemonic } = generateAddress

      if (walletMnemonic) {
        setMnemonic(walletMnemonic)
      }

      setPrivateKey(walletPrivateKey)
      setActiveDrawer('confirm')
    }
  }

  const onImportPrivateKey = (): void => {
    logEvent({
      name: ADD_ADDRESS_IMPORT,
    })

    history.push('/import-private-key', {
      symbol,
      chain,
      tokenName,
      contractAddress,
      decimals,
    })
  }

  const getCurrenciesList = (getCurrencyInfo?: ICurrency | undefined | null): string[] => {
    if (theta.coins.indexOf(symbol) !== -1) {
      return theta.coins.sort((a: string, b: string) => a.indexOf(symbol) - b.indexOf(symbol))
    } else if (chain && getCurrencyInfo) {
      return [symbol, getCurrencyInfo.symbol]
    }
    return [symbol]
  }

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = getItem('backup')

      if (backup && privateKey) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          let address

          if (mnemonic) {
            const tryImportPhrase = importRecoveryPhrase(symbol, mnemonic)
            if (tryImportPhrase) {
              address = tryImportPhrase.address
            }
          } else {
            address = importPrivateKey(symbol, privateKey, chain)
          }

          if (address) {
            const getCurrencyInfo = chain ? getCurrencyByChain(chain) : null
            const currenciesList = getCurrenciesList(getCurrencyInfo)

            const walletsList = addNewWallet(
              address,
              privateKey,
              decryptBackup,
              password,
              currenciesList,
              false,
              chain,
              tokenName,
              contractAddress,
              decimals,
              mnemonic
            )

            if (walletsList) {
              const walletAmount = JSON.parse(walletsList).filter(
                (wallet: IWallet) => wallet.symbol === symbol
              ).length

              setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

              logEvent({
                name: ADD_ADDRESS_CONFIRM,
              })

              setPrivateKey(null)

              setItem('backupStatus', 'notDownloaded')

              return setActiveDrawer('success')
            }
          }
        }
      }
    }
    return setErrorLabel('Password is not valid')
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password,
      from: 'newWallet',
    })
  }

  const onImportPhrase = (): void => {
    history.push('/import-recovery-phrase', {
      symbol,
    })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle={backTitle || 'Select currency'} />
        <Styles.Container>
          <Styles.Title>Add address</Styles.Title>
          <Styles.Description>
            You can generate a new address or import a private key to add the address you already
            use. Enter your password to keep your backup up-to-date and encrypted.
          </Styles.Description>

          {warning ? <Warning text={warning} /> : null}

          <Styles.Actions mt={warning ? 26 : 32}>
            {checkWithPhrase(symbol) ? (
              <Styles.Action onClick={onImportPhrase}>
                <Styles.ActionIcon>
                  <SVG
                    src="../../assets/icons/phrase.svg"
                    width={16}
                    height={16}
                    title="Import a recovery phrase"
                  />
                </Styles.ActionIcon>
                <Styles.ActionName>Import a recovery phrase</Styles.ActionName>
              </Styles.Action>
            ) : (
              <Styles.Action onClick={onImportPrivateKey}>
                <Styles.ActionIcon>
                  <SVG
                    src="../../assets/icons/import.svg"
                    width={18}
                    height={18}
                    title="Import a private key"
                  />
                </Styles.ActionIcon>
                <Styles.ActionName>Import a private key</Styles.ActionName>
              </Styles.Action>
            )}

            <Styles.Action onClick={onGenerateAddress}>
              <Styles.ActionIcon>
                <SVG
                  src="../../assets/icons/plusCircle.svg"
                  width={20}
                  height={20}
                  title="Generate a new address"
                />
              </Styles.ActionIcon>
              <Styles.ActionName>Generate a new address</Styles.ActionName>
            </Styles.Action>
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Please enter your password to add a new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirm}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
      <SuccessDrawer
        isActive={activeDrawer === 'success'}
        onClose={onDownloadBackup}
        text="The new address has been successfully added!"
      />
    </>
  )
}

export default NewWallet

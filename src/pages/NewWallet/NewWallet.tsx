import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Warning from '@components/Warning'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { logEvent, setUserProperties } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { addNew as addNewWallet, IWallet } from '@utils/wallet'
import { toUpper } from '@utils/format'
import { generate, importPrivateKey } from '@utils/address'

// Config
import { ADD_ADDRESS_GENERATE, ADD_ADDRESS_IMPORT, ADD_ADDRESS_CONFIRM } from '@config/events'
import { getCurrencyByChain } from '@config/currencies'

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
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

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
      const { privateKey: walletPrivateKey } = generateAddress

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

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup && privateKey) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const address = importPrivateKey(symbol, privateKey, chain)

          if (address) {
            const getCurrencyInfo = chain ? getCurrencyByChain(chain) : null
            const currenciesList =
              chain && getCurrencyInfo ? [symbol, getCurrencyInfo.symbol] : [symbol]

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
              decimals
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

              localStorage.setItem('backupStatus', 'notDownloaded')

              return history.replace('/download-backup', {
                password,
                from: 'newWallet',
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
        <Header withBack onBack={history.goBack} backTitle={backTitle || 'Select currency'} />
        <Styles.Container>
          <Styles.Title>Add address</Styles.Title>
          <Styles.Description>
            You can generate new address or import private key to add address you already use. Enter
            your password to keep your backup up-to-date and encrypted.
          </Styles.Description>

          {warning ? <Warning text={warning} /> : null}

          <Styles.Actions mt={warning ? 26 : 32}>
            <Styles.Action onClick={onImportPrivateKey} size={warning ? 'small' : 'big'}>
              <Styles.ActionIcon>
                <SVG
                  src="../../assets/icons/import.svg"
                  width={18}
                  height={18}
                  title="Import private key"
                />
              </Styles.ActionIcon>
              <Styles.ActionName>Import private key</Styles.ActionName>
            </Styles.Action>
            <Styles.Action onClick={onGenerateAddress} size={warning ? 'small' : 'big'}>
              <Styles.ActionIcon>
                <SVG
                  src="../../assets/icons/plusCircle.svg"
                  width={20}
                  height={20}
                  title="Generate new address"
                />
              </Styles.ActionIcon>
              <Styles.ActionName>Generate new address</Styles.ActionName>
            </Styles.Action>
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
        onConfirm={onConfirm}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
    </>
  )
}

export default NewWallet

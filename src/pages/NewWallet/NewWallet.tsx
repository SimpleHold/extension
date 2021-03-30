import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { v4 } from 'uuid'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { logEvent } from '@utils/amplitude'
import addressUtil, { TSymbols } from '@utils/address'
import { validatePassword } from '@utils/validate'
import { decrypt, encrypt } from '@utils/crypto'
import { addNew as addNewWallet } from '@utils/wallet'

// Config
import { ADD_ADDRESS_GENERATE, ADD_ADDRESS_IMPORT, ADD_ADDRESS_CONFIRM } from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: TSymbols
}

const NewWallet: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const history = useHistory()
  const {
    state: { symbol },
  } = useLocation<LocationState>()

  const onSuccess = (password: string): void => {
    logEvent({
      name: ADD_ADDRESS_CONFIRM,
    })

    setPrivateKey(null)

    localStorage.setItem('backupStatus', 'notDownloaded')

    history.push('/download-backup', {
      password,
      from: 'newWallet',
    })
  }

  const onGenerateAddress = (): void => {
    logEvent({
      name: ADD_ADDRESS_GENERATE,
    })

    const generate = new addressUtil(symbol).generate()

    if (generate) {
      const { privateKey: walletPrivateKey } = generate

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
    })
  }

  const onConfirm = (): void => {
    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup && privateKey) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)

          const address = new addressUtil(symbol).import(privateKey)

          if (address) {
            const uuid = v4()
            const newWalletsList = addNewWallet(address, symbol, uuid)

            parseBackup.wallets.push({
              symbol,
              address,
              uuid,
              privateKey,
            })

            if (newWalletsList) {
              localStorage.setItem('backup', encrypt(JSON.stringify(parseBackup), password))
              localStorage.setItem('wallets', newWalletsList)

              return onSuccess(password)
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
        <Header withBack onBack={history.goBack} backTitle="Wallets" />
        <Styles.Container>
          <Styles.Title>Select currency</Styles.Title>
          <Styles.Description>
            You can generate new address or import private key to add address you already use. Enter
            your password to keep your backup up-to-date and encrypted.
          </Styles.Description>

          <Styles.Actions>
            <Styles.Action onClick={onImportPrivateKey}>
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
            <Styles.Action onClick={onGenerateAddress}>
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

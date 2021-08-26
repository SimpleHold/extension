import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import Textarea from '@components/Textarea'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Utils
import { importRecoveryPhrase } from '@utils/currencies'
import { validatePassword } from '@utils/validate'
import { checkExistWallet, addNew as addNewWallet, IWallet } from '@utils/wallet'
import { getItem, setItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { setUserProperties } from '@utils/amplitude'
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
}

const ImportRecoveryPhrase: React.FC = () => {
  const [recoveryPhrase, setRecoveryPhrase] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [drawerErrorLabel, setDrawerErrorLabel] = React.useState<null | string>(null)

  const history = useHistory()
  const {
    state: { symbol },
  } = useLocation<LocationState>()

  const textareaInputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    textareaInputRef.current?.focus()
  }, [])

  const onImport = (): void => {
    const data = importRecoveryPhrase(symbol, recoveryPhrase)

    if (data) {
      const checkExist = checkExistWallet(data.address, symbol)

      if (checkExist) {
        return setErrorLabel('This address has already been added')
      }

      return setActiveDrawer('confirm')
    }
    return setErrorLabel('Invalid recovery phrase')
  }

  const onConfirm = (): void => {
    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, password)
      const recoveryData = importRecoveryPhrase(symbol, recoveryPhrase)

      if (decryptBackup && recoveryData) {
        const { address, privateKey } = recoveryData
        const walletsList = addNewWallet(
          address,
          privateKey,
          decryptBackup,
          password,
          [symbol],
          false,
          undefined,
          undefined,
          undefined,
          undefined,
          recoveryPhrase
        )

        if (walletsList) {
          setItem('backupStatus', 'notDownloaded')

          const walletAmount = JSON.parse(walletsList).filter(
            (wallet: IWallet) => wallet.symbol === symbol
          ).length
          setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

          return setActiveDrawer('success')
        }
      }
    }
    return setDrawerErrorLabel('Password is not valid')
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password,
      from: 'importRecoveryPhrase',
    })
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Add address" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Import recovery phrase</Styles.Title>
            <Styles.Description>
              Use your existing address to receive and send crypto. Just enter a recovery phrase of
              this address to import it into SimpleHold.
            </Styles.Description>
            <Link
              to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
              title="How it works?"
              mt={20}
            />
          </Styles.Row>

          <Styles.Form>
            <Textarea
              label="Enter recovery phrase"
              value={recoveryPhrase}
              onChange={setRecoveryPhrase}
              errorLabel={errorLabel}
              textareaRef={textareaInputRef}
            />

            <Styles.Actions>
              <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
              <Button
                label="Import"
                disabled={!recoveryPhrase.length}
                onClick={onImport}
                ml={7.5}
              />
            </Styles.Actions>
          </Styles.Form>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Please enter your password to add a new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirm}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={drawerErrorLabel}
      />
      <SuccessDrawer
        isActive={activeDrawer === 'success'}
        onClose={onDownloadBackup}
        text="The new address has been successfully added!"
      />
    </>
  )
}

export default ImportRecoveryPhrase

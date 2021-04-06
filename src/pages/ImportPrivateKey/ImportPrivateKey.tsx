import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { v4 } from 'uuid'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { validatePassword } from '@utils/validate'
import { checkExistWallet, addNew as addNewWallet, IWallet } from '@utils/wallet'
import bitcoinLike from '@utils/bitcoinLike'
import { decrypt, encrypt } from '@utils/crypto'
import { setUserProperties } from '@utils/amplitude'
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: TSymbols
}

const ImportPrivateKey: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [password, setPassword] = React.useState<string>('')

  const history = useHistory()
  const {
    state: { symbol },
  } = useLocation<LocationState>()

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    textInputRef.current?.focus()
  }, [])

  const onConfirm = (): void => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    const getAddress = new bitcoinLike(symbol).import(privateKey)

    if (getAddress) {
      const checkExist = checkExistWallet(getAddress)

      if (checkExist) {
        return setErrorLabel('This address has already been added')
      }
      return setActiveDrawer('confirm')
    }

    return setErrorLabel('Invalid private key')
  }

  const onConfirmDrawer = (): void => {
    const backup = localStorage.getItem('backup')

    if (backup && privateKey) {
      const decryptBackup = decrypt(backup, password)
      if (decryptBackup) {
        const parseBackup = JSON.parse(decryptBackup)
        const address = new bitcoinLike(symbol).import(privateKey)

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
            localStorage.setItem('backupStatus', 'notDownloaded')

            const walletAmount = JSON.parse(newWalletsList).filter(
              (wallet: IWallet) => wallet.symbol === symbol
            ).length
            setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

            return history.push('/download-backup', {
              password,
              from: 'privateKey',
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
        <Header withBack onBack={history.goBack} backTitle="Add address" />
        <Styles.Container>
          <Styles.Heading>
            <Styles.Title>Import private key</Styles.Title>
            <Styles.Description>
              Enter private key of existing address to import it in SimpleHold and use for receive
              and send crypto.
            </Styles.Description>
            <Link
              to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
              title="How it works?"
              mt={30}
            />
          </Styles.Heading>
          <Styles.Form>
            <TextInput
              label="Enter private key"
              value={privateKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPrivateKey(e.target.value)
              }
              errorLabel={errorLabel}
              inputRef={textInputRef}
            />
            <Styles.Actions>
              <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
              <Button label="Import" disabled={!privateKey.length} onClick={onConfirm} ml={7.5} />
            </Styles.Actions>
          </Styles.Form>
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

export default ImportPrivateKey

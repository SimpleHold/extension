import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Modals
import ConfirmAddNewAddressModal from '@modals/ConfirmAddNewAddress'

// Utils
import { validateBitcoinPrivateKey } from '@utils/validate'
import { checkExistWallet } from '@utils/wallet'
import address, { TSymbols } from '@utils/address'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: TSymbols
}

const ImportPrivateKey: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<string>('')
  const [activeModal, setActiveModal] = React.useState<null | string>(null)
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const history = useHistory()
  const {
    state: { symbol },
  } = useLocation<LocationState>()

  const onConfirm = (): void => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    const validate = validateBitcoinPrivateKey(privateKey)

    if (validate) {
      const getAddress = new address(symbol).import(privateKey)

      if (getAddress) {
        const checkExist = checkExistWallet(getAddress)

        if (checkExist) {
          return setErrorLabel('This address has already been added')
        }
        return setActiveModal('confirmAddAddress')
      }
    }

    return setErrorLabel('Invalid private key')
  }

  const onSuccess = (password: string): void => {
    setActiveModal(null)
    localStorage.setItem('backupStatus', 'notDownloaded')

    history.push('/download-backup', {
      password,
      from: 'privateKey',
    })
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
              The password needs to encrypt your private keys. We dont have access to your keys, so
              be careful.
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
            />
            <Styles.Actions>
              <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
              <Button label="Import" disabled={!privateKey.length} onClick={onConfirm} ml={7.5} />
            </Styles.Actions>
          </Styles.Form>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmAddNewAddressModal
        isActive={activeModal === 'confirmAddAddress'}
        onClose={() => setActiveModal(null)}
        privateKey={privateKey}
        onSuccess={onSuccess}
        symbol={symbol}
      />
    </>
  )
}

export default ImportPrivateKey

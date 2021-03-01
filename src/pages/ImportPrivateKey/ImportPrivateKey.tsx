import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Modals
import ConfirmAddNewAddressModal from '@modals/ConfirmAddNewAddress'

// Utils
import { importAddress } from '@utils/bitcoin'

// Styles
import Styles from './styles'

const ImportPrivateKey: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<string>('')
  const [isError, setIsError] = React.useState<boolean>(false)
  const [activeModal, setActiveModal] = React.useState<null | string>(null)

  const history = useHistory()

  const onConfirm = (): void => {
    if (isError) {
      setIsError(false)
    }

    const getAddress = importAddress(privateKey)

    if (getAddress) {
      return setActiveModal('confirmAddAddress')
    }

    return setIsError(true)
  }

  const onSuccess = (): void => {
    setActiveModal(null)
    history.goBack()
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
            <Link to="https://simplehold.io/how-it-works" title="How it works?" mt={30} />
          </Styles.Heading>
          <Styles.Form>
            <TextInput
              label="Enter private key"
              value={privateKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPrivateKey(e.target.value)
              }
              withError={isError}
              errorLabel="Invalid private key"
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
      />
    </>
  )
}

export default ImportPrivateKey

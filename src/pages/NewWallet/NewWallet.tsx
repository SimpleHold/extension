import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Modals
import ConfirmAddNewAddressModal from '@modals/ConfirmAddNewAddress'

// Icons
import importIcon from '@assets/icons/import.svg'
import plusCircleIcon from '@assets/icons/plusCircle.svg'

// Utils
import { generateWallet } from '@utils/bitcoin'

// Styles
import Styles from './styles'

const NewWallet: React.FC = () => {
  const [activeModal, setActiveModal] = React.useState<null | string>(null)
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)

  const history = useHistory()

  const openPage = (path: string): void => {
    history.push(path)
  }

  const onSuccess = (): void => {
    setActiveModal(null)
    setPrivateKey(null)
    history.goBack()
  }

  const onGenerateAddress = (): void => {
    const { privateKey: walletPrivateKey } = generateWallet()
    setPrivateKey(walletPrivateKey)
    setActiveModal('confirmAddAddress')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={() => openPage('/wallets')} backTitle="Wallets" />
        <Styles.Container>
          <Styles.Title>Add address</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
          </Styles.Description>

          <Styles.Actions>
            <Styles.Action onClick={() => openPage('/import-private-key')}>
              <Styles.ActionIcon>
                <SVG src={importIcon} width={18} height={18} title="import" />
              </Styles.ActionIcon>
              <Styles.ActionName>Import private key</Styles.ActionName>
            </Styles.Action>
            <Styles.Action onClick={onGenerateAddress}>
              <Styles.ActionIcon>
                <SVG src={plusCircleIcon} width={20} height={20} title="plus-circle" />
              </Styles.ActionIcon>
              <Styles.ActionName>Generate new address</Styles.ActionName>
            </Styles.Action>
          </Styles.Actions>
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

export default NewWallet

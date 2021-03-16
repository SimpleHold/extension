import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Modals
import ConfirmAddNewAddressModal from '@modals/ConfirmAddNewAddress'

// Utils
import { logEvent } from '@utils/amplitude'
import { generateWallet } from '@utils/bitcoin'

// Config
import { ADD_ADDRESS_GENERATE, ADD_ADDRESS_IMPORT, ADD_ADDRESS_CONFIRM } from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  provider: any
}

const NewWallet: React.FC = () => {
  const [activeModal, setActiveModal] = React.useState<null | string>(null)
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)

  const history = useHistory()
  const {
    state: { symbol, provider },
  } = useLocation<LocationState>()

  const onSuccess = (password: string): void => {
    logEvent({
      name: ADD_ADDRESS_CONFIRM,
    })

    setActiveModal(null)
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

    const { privateKey: walletPrivateKey } = generateWallet(provider)

    setPrivateKey(walletPrivateKey)
    setActiveModal('confirmAddAddress')
  }

  const onImportPrivateKey = (): void => {
    logEvent({
      name: ADD_ADDRESS_IMPORT,
    })

    history.push('/import-private-key', {
      symbol,
      provider,
    })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Wallets" />
        <Styles.Container>
          <Styles.Title>Add address</Styles.Title>
          <Styles.Description>
            The password needs to encrypt your private keys. We dont have access to your keys, so be
            careful.
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
      <ConfirmAddNewAddressModal
        isActive={activeModal === 'confirmAddAddress'}
        onClose={() => setActiveModal(null)}
        privateKey={privateKey}
        onSuccess={onSuccess}
        symbol={symbol}
        provider={provider}
      />
    </>
  )
}

export default NewWallet

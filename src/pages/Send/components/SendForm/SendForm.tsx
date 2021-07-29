import * as React from 'react'

// Components
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import WalletCard from '../WalletCard'
import FeeButton from '../FeeButton'

// Drawers
import WalletsDrawer from '@drawers/Wallets'

// Utils
import { toUpper } from '@utils/format'
import { THardware } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  onCancel: () => void
  balance: null | number
  estimated: null | number
  walletName: string
  address: string
  hardware?: THardware
  chain?: string
  name?: string
}

const SendForm: React.FC<Props> = (props) => {
  const { symbol, onCancel, balance, estimated, walletName, address, hardware, chain, name } = props

  const [destinationAddress, setDestinationAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [feeType, setFeeType] = React.useState<'Slow' | 'Average' | 'Fast'>('Average')
  const [activeDrawer, setActiveDrawer] = React.useState<'wallets' | null>(null)

  const onConfirm = (): void => {}

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const openWalletsDrawer = (): void => {
    setActiveDrawer('wallets')
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const renderAddressButton = destinationAddress?.length ? (
    <Styles.SendToMyWalletButton onClick={openWalletsDrawer}>
      <Styles.SendToMyWalletLabel>To my wallet</Styles.SendToMyWalletLabel>
    </Styles.SendToMyWalletButton>
  ) : null

  return (
    <>
      <Styles.Container>
        <Styles.Form onSubmit={onSubmitForm}>
          <WalletCard
            balance={balance}
            estimated={estimated}
            symbol={symbol}
            hardware={hardware}
            walletName={walletName}
            address={address}
            chain={chain}
            name={name}
          />
          <Styles.FormRow>
            <TextInput
              label="Recipient Address"
              value={destinationAddress}
              onChange={setDestinationAddress}
              button={renderAddressButton}
            />
            <TextInput label={`Amount (${toUpper(symbol)})`} value={amount} onChange={setAmount} />
            <Styles.NetworkFeeBlock>
              <Styles.NetworkFeeRow>
                <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
                <Styles.NetworkFee>0.0007632 BTC</Styles.NetworkFee>
              </Styles.NetworkFeeRow>
              <FeeButton type={feeType} onChange={setFeeType} />
            </Styles.NetworkFeeBlock>
          </Styles.FormRow>
        </Styles.Form>
        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
          <Button label="Send" disabled onClick={onConfirm} ml={7.5} />
        </Styles.Actions>
      </Styles.Container>
      <WalletsDrawer isActive={activeDrawer === 'wallets'} onClose={onCloseDrawer} />
    </>
  )
}

export default SendForm

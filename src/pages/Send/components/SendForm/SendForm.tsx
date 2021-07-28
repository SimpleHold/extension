import * as React from 'react'

// Components
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import WalletCard from '../WalletCard'
import FeeButton from '../FeeButton'

// Utils
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  onCancel: () => void
  balance: null | number
  estimated: null | number
}

const SendForm: React.FC<Props> = (props) => {
  const { symbol, onCancel, balance, estimated } = props

  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [feeType, setFeeType] = React.useState<'Slow' | 'Average' | 'Fast'>('Average')

  const onConfirm = (): void => {}

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Styles.Container>
      <Styles.Form onSubmit={onSubmitForm}>
        <WalletCard balance={balance} estimated={estimated} symbol={symbol} />
        <Styles.FormRow>
          <TextInput label="Recipient Address" value={address} onChange={setAddress} />
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
  )
}

export default SendForm

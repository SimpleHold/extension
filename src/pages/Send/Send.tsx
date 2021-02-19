import * as React from 'react'

// Components
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

const Send: React.FC = () => {
  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')

  return (
    <Styles.Wrapper>
      <Header />
      <Styles.Container>
        <Styles.Heading>
          <Styles.Title>Send</Styles.Title>
          <Styles.Balance>0.16823857 BTC</Styles.Balance>
          <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
        </Styles.Heading>
        <Styles.Form>
          <CurrenciesDropdown symbol="btc" />
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAddress(e.target.value)}
          />
          <TextInput
            label="Amount (BTC)"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAmount(e.target.value)}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            <Styles.NetworkFee>0.0000000001 BTC</Styles.NetworkFee>
          </Styles.NetworkFeeBlock>
          <Styles.Actions>
            <Button label="Cancel" />
            <Button label="Confirm" />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send

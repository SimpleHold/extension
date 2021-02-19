import * as React from 'react'

// Components
import Cover from '@components/Cover'
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
      <Cover />
      <Header />
      <Styles.Container>
        <Styles.Row>
          <Styles.PageTitle>Send</Styles.PageTitle>
          <Styles.Balance>0.16823857 BTC</Styles.Balance>
          <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
        </Styles.Row>
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
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send

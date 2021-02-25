import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

const Send: React.FC = () => {
  const history = useHistory()

  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')

  const openPage = (path: string, params: any = {}): void => {
    history.push(path, params)
  }

  const next = () => {
    openPage('/send-confirm')
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Wallet" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.PageTitle>Send</Styles.PageTitle>
          <Styles.Balance>0.16823857 BTC</Styles.Balance>
          <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
        </Styles.Row>
        <Styles.Form>
          <CurrenciesDropdown symbol="btc" isDisabled />
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
            <Button label="Cancel" isLight onClick={() => null} mr={7.5} />
            <Button label="Send" onClick={() => openPage('/send-confirm')} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send

import * as React from 'react'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'

// Styles
import Styles from './styles'

const SendConfirmation: React.FC = () => {
  const [password, setPassword] = React.useState<string>('')

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Send" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Check transaction details and confirm sending:</Styles.Title>
          <Styles.List>
            <Styles.ListTitle>Amount:</Styles.ListTitle>
            <Styles.ListText>0.002 BTC</Styles.ListText>
          </Styles.List>
          <Styles.List>
            <Styles.ListTitle>Network fee:</Styles.ListTitle>
            <Styles.ListText>0.0000001 BTC</Styles.ListText>
          </Styles.List>
          <Styles.DashedDivider>
            <Styles.DashedDividerLine />
          </Styles.DashedDivider>
          <Styles.List>
            <Styles.ListTitle>Total:</Styles.ListTitle>
            <Styles.ListText>0.00200001 BTC</Styles.ListText>
          </Styles.List>
        </Styles.Row>
        <Styles.Form>
          <TextInput
            label="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
          />
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SendConfirmation

import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'

// Styles
import Styles from './styles'

interface ILocationState {}

const SendConfirmation: React.FC = () => {
  const history = useHistory()
  const { state } = useLocation<ILocationState>()

  const onCancel = (): void => {
    history.goBack()
  }

  const onConfirm = (): void => {}

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Send" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.CurrencyLogo>
            <CurrencyLogo size={50} symbol="btc" />
          </Styles.CurrencyLogo>
          <Styles.Title>Confirm the sending</Styles.Title>
          <Styles.SubTitle>Check transaction details</Styles.SubTitle>
        </Styles.Row>
        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
          <Button label="Confirm" onClick={onConfirm} ml={7.5} />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SendConfirmation

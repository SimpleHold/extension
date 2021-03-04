import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Modals
import ConfirmModal from '@modals/Confirm'

// Utils
import { toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'

// Styles
import Styles from './styles'

interface LocationState {
  amount: number
  symbol: string
  networkFee: number
  addressFrom: string
  addressTo: string
}

const SendConfirmation: React.FC = () => {
  const history = useHistory()
  const {
    state: { amount, symbol, networkFee, addressFrom, addressTo },
  } = useLocation<LocationState>()

  const [activeModal, setActiveModal] = React.useState<null | string>(null)
  const [password, setPassword] = React.useState<string>('')

  const onConfirm = (): void => {
    setActiveModal('confirmSending')
  }

  const onConfirmModal = (): void => {}

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Send" onBack={history.goBack} />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Confirm sending</Styles.Title>
            <Styles.Description>Check transaction details and confirm sending:</Styles.Description>

            <Styles.OrderCheck>
              <Styles.List>
                <Styles.ListTitle>Amount:</Styles.ListTitle>
                <Styles.ListText>
                  {amount} {toUpper(symbol)}
                </Styles.ListText>
              </Styles.List>
              <Styles.List>
                <Styles.ListTitle>Network fee:</Styles.ListTitle>
                <Styles.ListText>
                  {networkFee} {toUpper(symbol)}
                </Styles.ListText>
              </Styles.List>

              <Styles.DashedDivider>
                <Styles.DashedDividerLine />
              </Styles.DashedDivider>

              <Styles.List>
                <Styles.ListTitle>Total:</Styles.ListTitle>
                <Styles.ListText>
                  {amount + networkFee} {toUpper(symbol)}
                </Styles.ListText>
              </Styles.List>
            </Styles.OrderCheck>

            <Styles.DestinationsList>
              <Styles.Destinate>
                <Styles.DestinateTitle>From</Styles.DestinateTitle>
                <Styles.DestinateText>{addressFrom}</Styles.DestinateText>
              </Styles.Destinate>
              <Styles.Destinate>
                <Styles.DestinateTitle>To</Styles.DestinateTitle>
                <Styles.DestinateText>{addressTo}</Styles.DestinateText>
              </Styles.Destinate>
            </Styles.DestinationsList>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={history.goBack} mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>

      <ConfirmModal
        isActive={activeModal === 'confirmSending'}
        onClose={() => setActiveModal(null)}
        title="Confirm sending"
        inputLabel="Enter password"
        inputType="password"
        inputValue={password}
        inputErrorLabel={null}
        onChangeInput={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setPassword(e.target.value)
        }
        isDisabledConfirmButton={!validatePassword(password)}
        onConfirm={onConfirmModal}
      />
    </>
  )
}

export default SendConfirmation

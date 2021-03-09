import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Modals
import ConfirmModal from '@modals/Confirm'
import SuccessSendModal from '@modals/SuccessSend'

// Utils
import { toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { IRawTransaction, IBitcoreUnspentOutput, sendRawTransaction } from '@utils/bitcoin'
import { logEvent } from '@utils/amplitude'

// Config
import {
  ADDRESS_SEND_CONFIRM,
  ADDRESS_SEND_CONFIRM_CANCEL,
  ADDRESS_SEND_PASSWORD,
  ADDRESS_SEND_PASSWORD_CANCEL,
} from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  amount: number
  symbol: string
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: IBitcoreUnspentOutput[]
}

const SendConfirmation: React.FC = () => {
  const history = useHistory()
  const {
    state: { amount, symbol, networkFee, addressFrom, addressTo, outputs },
  } = useLocation<LocationState>()

  const [activeModal, setActiveModal] = React.useState<null | 'confirmSending' | 'success'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [inputErrorLabel, setInputErrorLabel] = React.useState<null | string>(null)
  const [rawTransaction, setRawTransaction] = React.useState<null | IRawTransaction>(null)

  const onConfirmModal = async (): Promise<void> => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD,
    })

    if (inputErrorLabel) {
      setInputErrorLabel(null)
    }

    const backup = localStorage.getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).find(
          (wallet: IWallet) => wallet.address === addressFrom
        )

        if (findWallet) {
          const transaction: IRawTransaction | null = window.createTransaction(
            outputs,
            addressTo,
            window.btcToSat(amount),
            window.btcToSat(networkFee),
            addressFrom,
            findWallet.privateKey
          )

          if (transaction?.hash && transaction?.raw) {
            const sendTransaction = await sendRawTransaction(transaction.raw)

            if (sendTransaction === transaction.hash) {
              setRawTransaction(transaction)
              return setActiveModal('success')
            }
          }

          return setInputErrorLabel('Error while creating transaction')
        }
      }
    }

    return setInputErrorLabel('Password is not valid')
  }

  const onCancel = (): void => {
    logEvent({
      name: ADDRESS_SEND_CONFIRM_CANCEL,
    })

    history.goBack()
  }

  const onConfirm = (): void => {
    logEvent({
      name: ADDRESS_SEND_CONFIRM,
    })

    setActiveModal('confirmSending')
  }

  const onCloseConfirmModal = (): void => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD_CANCEL,
    })

    setActiveModal(null)
  }

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
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>

      <ConfirmModal
        isActive={activeModal === 'confirmSending'}
        onClose={onCloseConfirmModal}
        title="Confirm sending"
        inputLabel="Enter password"
        inputType="password"
        inputValue={password}
        inputErrorLabel={inputErrorLabel}
        onChangeInput={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setPassword(e.target.value)
        }
        isDisabledConfirmButton={!validatePassword(password)}
        onConfirm={onConfirmModal}
      />

      <SuccessSendModal
        isActive={activeModal === 'success'}
        onClose={() => setActiveModal(null)}
        transactionHash={rawTransaction?.hash}
      />
    </>
  )
}

export default SendConfirmation

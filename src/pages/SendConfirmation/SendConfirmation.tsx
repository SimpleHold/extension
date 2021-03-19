import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Transaction } from 'bitcore-lib'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Utils
import { toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { IRawTransaction, sendRawTransaction } from '@utils/bitcoin'
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
  outputs: Transaction.UnspentOutput[]
}

const SendConfirmation: React.FC = () => {
  const history = useHistory()
  const {
    state: { amount, symbol, networkFee, addressFrom, addressTo, outputs },
  } = useLocation<LocationState>()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
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
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (wallet: IWallet) => wallet.address === addressFrom
        )

        if (findWallet?.privateKey) {
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
              return setActiveDrawer('success')
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

    setActiveDrawer('confirm')
  }

  const onCloseConfirmModal = (): void => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD_CANCEL,
    })

    setActiveDrawer(null)
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

      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={onCloseConfirmModal}
        title="Confirm sending"
        inputLabel="Enter password"
        textInputType="password"
        textInputValue={password}
        inputErrorLabel={inputErrorLabel}
        onChangeInput={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setPassword(e.target.value)
        }
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmModal}
      />

      <SuccessDrawer
        isActive={activeDrawer === 'success'}
        onClose={() => setActiveDrawer(null)}
        text="Your transaction has successfully sent. You can check it here:"
        link={`https://blockchair.com/bitcoin/transaction/${rawTransaction?.hash}`}
      />
    </>
  )
}

export default SendConfirmation

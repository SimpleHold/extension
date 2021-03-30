import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'

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
import { IRawTransaction, sendRawTransaction, btcToSat, satToBtc } from '@utils/bitcoin'
import { logEvent } from '@utils/amplitude'
import address, { TSymbols } from '@utils/address'

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
  symbol: TSymbols
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: UnspentOutput[]
}

const SendConfirmation: React.FC = () => {
  const history = useHistory()
  const {
    state: { amount, symbol, networkFee, addressFrom, addressTo, outputs },
    state,
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
          const transaction: TCreatedTransaction | null = new address(symbol).createTransaction(
            outputs,
            addressTo,
            btcToSat(amount),
            satToBtc(networkFee),
            addressFrom,
            findWallet.privateKey
          )

          console.log('transaction', transaction)

          // if (transaction?.hash && transaction?.raw) {
          //   const sendTransaction = await sendRawTransaction(transaction.raw, symbol)

          //   if (sendTransaction === transaction.hash) {
          //     setRawTransaction(transaction)
          //     return setActiveDrawer('success')
          //   }
          // }

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
                <Styles.ListRow>
                  <Styles.Amount>{numeral(amount).format('0.[00000000]')}</Styles.Amount>
                  <Styles.ListText>{toUpper(symbol)}</Styles.ListText>
                </Styles.ListRow>
              </Styles.List>
              <Styles.List>
                <Styles.ListTitle>Network fee:</Styles.ListTitle>
                <Styles.ListRow>
                  <Styles.Amount>{numeral(networkFee).format('0.[00000000]')}</Styles.Amount>
                  <Styles.ListText>{toUpper(symbol)}</Styles.ListText>
                </Styles.ListRow>
              </Styles.List>

              <Styles.DashedDivider>
                <Styles.DashedDividerLine />
              </Styles.DashedDivider>

              <Styles.List>
                <Styles.ListTitle>Total:</Styles.ListTitle>
                <Styles.ListRow>
                  <Styles.Amount>
                    {numeral(amount + networkFee).format('0.[00000000]')}
                  </Styles.Amount>
                  <Styles.ListText>{toUpper(symbol)}</Styles.ListText>
                </Styles.ListRow>
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
        onChangeText={setPassword}
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

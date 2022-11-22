import * as React from 'react'
import { observer } from 'mobx-react-lite'

// Components
import LightHeader from '@components/LightHeader'
import SendProgress from '@containers/Send/components/SendProgress'
import Button from '@components/Button'
import SendConfirmForm from '@components/SendConfirmForm'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { plus, minusString } from '@utils/bn'

// Hooks
import useState from '@hooks/useState'

// Styles
import Styles from './styles'

interface IState {
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'feedback'
  password: string
  inputErrorLabel: null | string
  txLink: string
  isButtonLoading: boolean
  failText: string
  logCaptured: boolean
  amount: string
}

interface Props {
  onBack: () => void
  onConfirm: () => void
  onCancel: () => void
  address: string
  feeEstimated: number
  amount: string
  openFrom?: string
}

const initialState: IState = {
  activeDrawer: null,
  password: '',
  inputErrorLabel: null,
  txLink: '',
  isButtonLoading: false,
  failText: '',
  logCaptured: false,
  amount: '',
}

const SendConfirmContainer: React.FC<Props> = (props) => {
  const { onBack, onConfirm, onCancel, address, feeEstimated, amount, openFrom } = props

  const { fee, balance } = useSendStore()
  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    checkAmount()
  }, [state.amount])

  React.useEffect(() => {
    if (props.amount.length && !state.amount.length) {
      updateState({ amount })
    }
  }, [props.amount, state.amount])

  React.useEffect(() => {
    if (state.inputErrorLabel && state.isButtonLoading) {
      updateState({ isButtonLoading: false })
    }
  }, [state.inputErrorLabel, state.isButtonLoading])

  const checkAmount = (): void => {
    if (plus(state.amount, fee) > Number(balance)) {
      updateState({ amount: minusString(balance, fee) })
    }
  }

  return (
    <Styles.Container>
      {openFrom !== 'browser' ? <LightHeader title="Confirmation" onBack={onBack} /> : null}
      <Styles.Row openFrom={openFrom}>
        <Styles.Top>
          <SendProgress step="confirm" pb={16} />
          <SendConfirmForm addressTo={address} amount={state.amount} feeEstimated={feeEstimated} />
        </Styles.Top>
        {openFrom !== 'browser' ? (
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              isLoading={state.isButtonLoading}
              ml={7.5}
            />
          </Styles.Actions>
        ) : null}
      </Styles.Row>
    </Styles.Container>
  )
}

export default observer(SendConfirmContainer)

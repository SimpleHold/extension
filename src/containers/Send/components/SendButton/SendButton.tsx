import * as React from 'react'
import { observer } from 'mobx-react-lite'

// Components
import Button from '@components/Button'

// Store
import { useSendStore } from '@store/send/store'

interface Props {
  onNext: () => void
}

const SendButton: React.FC<Props> = (props) => {
  const { onNext } = props

  const {
    isFeeLoading,
    amount,
    isZeroFee,
    fee,
    balance,
    isCurrencyBalanceError,
    wallet,
    currencyInfo,
    warning,
  } = useSendStore()

  const isButtonDisabled =
    isFeeLoading ||
    !amount.length ||
    (isZeroFee ? false : fee === 0) ||
    Number(balance) === 0 ||
    Number(amount) > Number(balance) ||
    isCurrencyBalanceError ||
    Number(amount) <= 0 ||
    !wallet ||
    !currencyInfo ||
    warning !== null

  return <Button label="Next" mt={24} onClick={onNext} disabled={isButtonDisabled} />
}

export default observer(SendButton)

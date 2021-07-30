import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import TextInput from '@components/TextInput'
import FeeButton from '../FeeButton'
import Spinner from '@components/Spinner'

// Utils
import { toUpper } from '@utils/format'
import { getNetworkFeeSymbol } from '@utils/address'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Types
import { ICardanoUnspentTxOutput } from '@utils/currencies/cardano'

// Styles
import Styles from './styles'

type TInput = {
  value: string
  onChange: (value: string) => void
  errorLabel: string | null
}

type TInputs = 'address' | 'amount' | 'extraId'

interface Props {
  symbol: string
  chain?: string
  destination: TInput
  amount: TInput
  extraId: TInput
  extraIdName: string | null
  isDisabled: boolean
  balance: null | number
  openWalletsDrawer: () => void
}

const SendForm: React.FC<Props> = (props) => {
  const {
    symbol,
    chain,
    destination,
    amount,
    extraId,
    extraIdName,
    isDisabled,
    balance,
    openWalletsDrawer,
  } = props

  const [feeType, setFeeType] = React.useState<'Slow' | 'Average' | 'Fast'>('Average')
  const [fee, setFee] = React.useState<number>(0)
  const [feeSymbol, setFeeSymbol] = React.useState<string>('')
  const [isFeeLoading, setFeeLoading] = React.useState<boolean>(false)
  const [utxos, setUtxos] = React.useState<UnspentOutput[] | ICardanoUnspentTxOutput[]>([])
  const [focusedInput, setFocusedInput] = React.useState<TInputs | null>(null)

  const debounced = useDebounce(amount.value, 1000)

  React.useEffect(() => {
    getFeeSymbol()
  }, [])

  React.useEffect(() => {
    if (amount.value.length && Number(balance) > 0 && !amount.errorLabel) {
      setFeeLoading(true)
      getFee()
    }
  }, [debounced])

  const getFee = async (): Promise<void> => {
    // const getTokenDecimals = chain ? getToken(symbol, chain)?.decimals : decimals
  }

  const getFeeSymbol = (): void => {
    setFeeSymbol(getNetworkFeeSymbol(symbol, chain))
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const onFocusInput = (inputType: TInputs) => (): void => {
    setFocusedInput(inputType)
  }

  const onCleanInput = (): void => {
    if (focusedInput === 'address') {
      destination.onChange('')
    } else if (focusedInput === 'amount') {
      amount.onChange('')
    } else {
      extraId.onChange('')
    }
  }

  const onGenerateExtraId = (): void => {}

  const onSendAll = (): void => {}

  const renderInputButton = (
    input: TInput,
    inputType: TInputs,
    label: string,
    handler: () => void
  ): React.ReactElement<any, any> | null => {
    if (focusedInput === inputType) {
      if (input.value.length) {
        return (
          <Styles.RemoveButton onClick={onCleanInput}>
            <SVG src="../../../assets/icons/times.svg" width={10} height={10} />
          </Styles.RemoveButton>
        )
      }
      return (
        <Styles.InputButton onClick={handler}>
          <Styles.InputButtonLabel>{label}</Styles.InputButtonLabel>
        </Styles.InputButton>
      )
    }
    return null
  }

  return (
    <Styles.Container onSubmit={onSubmitForm}>
      <TextInput
        label="Recipient Address"
        value={destination.value}
        onChange={destination.onChange}
        disabled={isDisabled}
        button={renderInputButton(destination, 'address', 'To my wallet', openWalletsDrawer)}
        onFocus={onFocusInput('address')}
      />
      {extraIdName ? (
        <TextInput
          label={`${extraIdName} (optional)`}
          value={extraId.value}
          onChange={extraId.onChange}
          disabled={isDisabled}
          button={renderInputButton(destination, 'extraId', 'Generate', onGenerateExtraId)}
          onFocus={onFocusInput('extraId')}
        />
      ) : null}
      <TextInput
        label={`Amount (${toUpper(symbol)})`}
        value={amount.value}
        onChange={amount.onChange}
        disabled={isDisabled}
        button={renderInputButton(destination, 'amount', 'Send all', onSendAll)}
        onFocus={onFocusInput('amount')}
      />

      <Styles.NetworkFeeBlock>
        <Styles.NetworkFeeRow>
          <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
          {isFeeLoading ? (
            <Spinner size={16} />
          ) : (
            <Styles.NetworkFee>
              {fee === 0 ? '-' : `${fee} ${toUpper(feeSymbol)}`}
            </Styles.NetworkFee>
          )}
        </Styles.NetworkFeeRow>
        <FeeButton type={feeType} onChange={setFeeType} />
      </Styles.NetworkFeeBlock>
    </Styles.Container>
  )
}

export default SendForm

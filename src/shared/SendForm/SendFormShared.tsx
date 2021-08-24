import * as React from 'react'

// Components
import TextInput from '@components/TextInput'

// Utils
import { toUpper } from '@utils/format'

// Types
import { Props } from './types'

// Styles
import Styles from './styles'

const SendFormShared: React.FC<Props> = (props) => {
  const {
    balance,
    symbol,
    wallets,
    address,
    setAddress,
    addressErrorLabel,
    openWalletsDrawer,
    onGenerateExtraId,
    checkAddress,
    onSendAll,
    extraIdName,
    extraId,
    setExtraId,
    amount,
    setAmount,
    amountErrorLabel,
    checkAmount,
    amountLabel,
    openFrom,
    disabled,
  } = props

  const renderInputButton = (inputType: 'address' | 'extraId' | 'amount') => {
    if (inputType === 'address' && wallets.length > 1) {
      return {
        label: 'To my wallet',
        onClick: openWalletsDrawer,
      }
    }

    if (inputType === 'extraId') {
      return {
        label: 'Generate',
        onClick: onGenerateExtraId,
      }
    }

    if (inputType === 'amount' && Number(balance) > 0) {
      return {
        label: 'Send all',
        onClick: onSendAll,
      }
    }

    return undefined
  }

  const getAmountTooltip = (): string | undefined => {
    if (toUpper(symbol) === 'XRP' && amountErrorLabel) {
      return 'The network requires at least 20 XRP balance at all times.'
    }

    return undefined
  }

  return (
    <Styles.Container>
      <TextInput
        label="Recipient Address"
        value={address}
        onChange={setAddress}
        disabled={balance === null || disabled}
        type="text"
        renderButton={renderInputButton('address')}
        errorLabel={addressErrorLabel}
        onBlurInput={checkAddress}
        openFrom={openFrom}
      />
      {extraIdName ? (
        <TextInput
          label={`${extraIdName} (optional)`}
          value={extraId}
          onChange={setExtraId}
          disabled={balance === null || disabled}
          type="text"
          renderButton={renderInputButton('extraId')}
          openFrom={openFrom}
        />
      ) : null}
      <TextInput
        label={amountLabel || `Amount (${toUpper(symbol)})`}
        value={amount}
        onChange={setAmount}
        disabled={balance === null || disabled}
        type="number"
        renderButton={renderInputButton('amount')}
        errorLabel={amountErrorLabel}
        onBlurInput={checkAmount}
        labelTooltip={getAmountTooltip()}
        openFrom={openFrom}
      />
    </Styles.Container>
  )
}

export default SendFormShared

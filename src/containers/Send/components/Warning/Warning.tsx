import * as React from 'react'
import SVG from 'react-inlinesvg'
import { observer } from 'mobx-react-lite'

// Store
import { useSendStore } from '@store/send/store'

// Coins
import { formatUnit } from '@coins/index'

// Utils
import { toUpper } from '@utils/format'

// Assets
import sendWarningIcon from '@assets/icons/sendWarning.svg'

// Styles
import Styles from './styles'

const Warning: React.FC = () => {
  const {
    amount,
    balance,
    wallet,
    setFee,
    setAmount,
    warning,
    setWarning,
    currencyInfo,
    setActiveDrawer,
    isBalanceLoading,
  } = useSendStore()

  React.useEffect(() => {
    if (amount.length && Number(amount) > Number(balance) && !isBalanceLoading) {
      setWarning({
        value: 'Insufficient funds',
      })
    } else if (warning) {
      setWarning(null)
    }

    checkMinAmount()
  }, [amount, balance, wallet, isBalanceLoading])

  const checkMinAmount = (): void => {
    if (currencyInfo && Number(amount) > 0 && wallet) {
      const { symbol, chain } = wallet

      const getAmount = +formatUnit(symbol, amount, 'to', chain)
      const minAmount = +formatUnit(symbol, currencyInfo.minSendAmount, 'from', chain)

      if (Number(getAmount) < +currencyInfo.minSendAmount) {
        setFee(0)

        return setWarning({
          value: 'Min amount is',
          pressableValue: `${minAmount} ${toUpper(symbol)}`,
          pressable: `${minAmount}`,
        })
      }
    }

    if (Number(amount) > 0 && Number(amount) % 1 !== 0 && wallet && wallet.symbol === 'neo') {
      setFee(0)

      return setWarning({
        value: 'You cannot send fractional amounts of NEO',
      })
    }
  }

  const onClickValue = (value: string) => (): void => {
    setAmount(value)
  }

  const onClick = (isXrpWarning: boolean) => (): void => {
    if (isXrpWarning) {
      setActiveDrawer('insufficientFee')
    }
  }

  if (warning) {
    const { value, pressable, pressableValue } = warning
    const isXrpWarning = wallet?.symbol === 'xrp' && value === 'Insufficient funds'

    return (
      <Styles.Container isDisabled={!isXrpWarning} onClick={onClick(isXrpWarning)}>
        <SVG src={sendWarningIcon} width={20} height={20} />
        <Styles.Title>{value}</Styles.Title>
        {pressable && pressableValue ? (
          <Styles.Pressable onClick={onClickValue(pressable)}>{pressableValue}</Styles.Pressable>
        ) : null}
      </Styles.Container>
    )
  }

  return null
}

export default observer(Warning)

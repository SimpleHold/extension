import * as React from 'react'
import SVG from 'react-inlinesvg'
import { observer } from 'mobx-react-lite'

// Components
import Spinner from '@components/Spinner'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { formatFee, toUpper } from '@utils/format'

// Coins
import {
  checkIsCustomFee,
  getNetworkFeeSymbol,
  checkIsFeeApproximate,
  isEthChain,
} from '@coins/index'

// Assets
import feeArrowIcon from '@assets/icons/feeArrow.svg'

// Styles
import Styles from './styles'

const FeeButton: React.FC = () => {
  const {
    setActiveDrawer,
    fee,
    isZeroFee,
    isFeeLoading,
    feeType,
    isCurrencyBalanceError,
    feeSymbol,
    warning,
    setFeeSymbol,
    wallet,
    currencyInfo,
  } = useSendStore()

  const isCustomFee =
    wallet && currencyInfo ? checkIsCustomFee(wallet.symbol, currencyInfo?.tokenChain) : false
  const isFeeApproximate =
    wallet && currencyInfo ? checkIsFeeApproximate(wallet.symbol, currencyInfo?.tokenChain) : false

  React.useEffect(() => {
    if (wallet && currencyInfo) {
      setFeeSymbol(getNetworkFeeSymbol(wallet.symbol, currencyInfo?.tokenChain))
    }
  }, [wallet, currencyInfo])

  const isFeeDisabled = (!isCustomFee && !isCurrencyBalanceError) || isFeeLoading

  const onViewFee = (): void => {
    const isBalanceError = isCurrencyBalanceError && !currencyInfo?.tokenChain
    const isNotEthToken =
      currencyInfo?.tokenChain !== undefined && !isEthChain(currencyInfo?.tokenChain)

    if (isBalanceError || isNotEthToken) {
      setActiveDrawer('insufficientFee')
    } else {
      setActiveDrawer('networkFee')
    }
  }

  const onClick = () => {
    if (!isFeeDisabled) {
      onViewFee()
    }
  }

  if (fee !== 0 || isZeroFee || isFeeLoading) {
    return (
      <Styles.Container onClick={onClick} isDisabled={isFeeDisabled}>
        <Styles.Row withWarning={warning !== null}>
          <Styles.FeeLabel>{isCustomFee ? `${feeType} fee` : 'Network Fee'}:</Styles.FeeLabel>

          {isFeeLoading ? (
            <Spinner size={16} ml={10} />
          ) : (
            <Styles.Fee>
              {isFeeApproximate ? '≈' : ''}
              {isZeroFee ? 0 : formatFee(fee) || '-'} {toUpper(feeSymbol)}
            </Styles.Fee>
          )}

          {isCustomFee || isCurrencyBalanceError ? (
            <SVG src={feeArrowIcon} width={20} height={20} />
          ) : null}
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default observer(FeeButton)

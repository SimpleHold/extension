import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Switch from '@components/Switch'
import FeeButton from '../FeeButton'

// Utils
import { toLower } from '@utils/format'
import { checkIsZeroFee } from '@coins/index'

// Types
import { TFeeValue } from '../types'
import { TFeeTypes } from '@utils/api/types'

// Styles
import Styles from './styles'

interface Props {
  isLoading: boolean
  fee: number
  feeSymbol: string
  type: TFeeTypes
  setType: (type: TFeeTypes) => void
  isBalanceError: boolean
  withButton?: boolean
  isIncludeFee: boolean
  toggleIncludeFee: () => void
  showFeeDrawer: () => void
  values: TFeeValue[]
  symbol: string
  openFrom?: string
}

const NetworkFee: React.FC<Props> = (props) => {
  const {
    isLoading,
    fee,
    feeSymbol,
    type,
    setType,
    isBalanceError,
    withButton = false,
    isIncludeFee,
    toggleIncludeFee,
    showFeeDrawer,
    values,
    symbol,
    openFrom,
  } = props

  return (
    <Styles.Container>
      <Styles.Row>
        <FeeButton
          type={type}
          onChange={setType}
          isError={isBalanceError}
          isLoading={isLoading}
          fee={fee}
          withButton={withButton}
          symbol={feeSymbol}
          values={values}
          openFrom={openFrom}
        />
        {toLower(symbol) === toLower(feeSymbol) && !checkIsZeroFee(symbol) ? (
          <Styles.IncludeBlock>
            <Styles.IncludeLabel>Include Fee</Styles.IncludeLabel>
            <Styles.SwitchRow>
              <Switch value={isIncludeFee} onToggle={toggleIncludeFee} openFrom={openFrom} />
            </Styles.SwitchRow>
          </Styles.IncludeBlock>
        ) : null}
      </Styles.Row>

      <Styles.AboutFee onClick={showFeeDrawer}>
        <SVG src="../../assets/icons/ask.svg" width={15} height={15} />
        <Styles.AboutFeeLabel>What is Network Fee</Styles.AboutFeeLabel>
      </Styles.AboutFee>
    </Styles.Container>
  )
}

export default NetworkFee

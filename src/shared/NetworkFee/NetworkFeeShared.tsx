import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Switch from '@components/Switch'
import FeeButton from '../FeeButton'

// Types
import { TFeeValue } from '../types'

// Styles
import Styles from './styles'

interface Props {
  isLoading: boolean
  fee: number
  symbol: string
  type: TFeeTypes
  setType: (type: TFeeTypes) => void
  isBalanceError: boolean
  withButton?: boolean
  isIncludeFee: boolean
  toggleIncludeFee: () => void
  showFeeDrawer: () => void
  values: TFeeValue[]
  openFrom?: string
}

const NetworkFee: React.FC<Props> = (props) => {
  const {
    isLoading,
    fee,
    symbol,
    type,
    setType,
    isBalanceError,
    withButton = false,
    isIncludeFee,
    toggleIncludeFee,
    showFeeDrawer,
    values,
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
          symbol={symbol}
          values={values}
          openFrom={openFrom}
        />
        <Styles.IncludeBlock>
          <Styles.IncludeLabel>Include Fee</Styles.IncludeLabel>
          <Styles.SwitchRow>
            <Switch value={isIncludeFee} onToggle={toggleIncludeFee} openFrom={openFrom} />
          </Styles.SwitchRow>
        </Styles.IncludeBlock>
      </Styles.Row>

      <Styles.AboutFee onClick={showFeeDrawer}>
        <SVG src="../../assets/icons/ask.svg" width={15} height={15} />
        <Styles.AboutFeeLabel>What is Network Fee</Styles.AboutFeeLabel>
      </Styles.AboutFee>
    </Styles.Container>
  )
}

export default NetworkFee

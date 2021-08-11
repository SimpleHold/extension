import * as React from 'react'
// Components
import Switch from '@components/Switch'

import FeeButton from '../FeeButton'

// Types
import { TFees } from '../../types'

// Styles
import Styles from './styles'

interface Props {
  isLoading: boolean
  fee: number
  symbol: string
  type: TFees
  setType: (type: TFees) => void
  isBalanceError: boolean
  withButton: boolean
  isIncludeFee: boolean
  toggleIncludeFee: () => void
}

const NetworkFee: React.FC<Props> = (props) => {
  const {
    isLoading,
    fee,
    symbol,
    type,
    setType,
    isBalanceError,
    withButton,
    isIncludeFee,
    toggleIncludeFee,
  } = props

  return (
    <Styles.Container>
      <FeeButton
        type={type}
        onChange={setType}
        isError={isBalanceError}
        isLoading={isLoading}
        fee={fee}
        withButton={withButton}
        symbol={symbol}
      />
      <Styles.IncludeBlock>
        <Styles.IncludeLabel>Include Fee</Styles.IncludeLabel>
        <Styles.SwitchRow>
          <Switch value={isIncludeFee} onToggle={toggleIncludeFee} />
        </Styles.SwitchRow>
      </Styles.IncludeBlock>
    </Styles.Container>
  )
}

export default NetworkFee

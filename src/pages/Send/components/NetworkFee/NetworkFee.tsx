import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Spinner from '@components/Spinner'
import Tooltip from '@components/Tooltip'

import FeeButton from '../FeeButton'

// Utils
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

type TFeeTypes = 'slow' | 'average' | 'fast'

interface Props {
  isLoading: boolean
  fee: number
  symbol: string
  type: TFeeTypes
  setType: (type: TFeeTypes) => void
  isBalanceError: boolean
  withButton: boolean
}

const NetworkFee: React.FC<Props> = (props) => {
  const { isLoading, fee, symbol, type, setType, isBalanceError, withButton } = props

  return (
    <Styles.Container>
      <Styles.Row>
        <Styles.Label>Network fee:</Styles.Label>
        {isLoading ? (
          <Spinner size={16} />
        ) : (
          <Styles.FeeRow>
            <Styles.Fee isError={isBalanceError}>
              {fee === 0 ? '-' : `${fee} ${toUpper(symbol)}`}
            </Styles.Fee>
            {isBalanceError ? (
              <Styles.IconRow>
                <Tooltip text="Insufficient funds" mt={5}>
                  <SVG src="../../assets/icons/warning.svg" width={12} height={12} />
                </Tooltip>
              </Styles.IconRow>
            ) : null}
          </Styles.FeeRow>
        )}
      </Styles.Row>
      {withButton ? <FeeButton type={type} onChange={setType} /> : null}
    </Styles.Container>
  )
}

export default NetworkFee

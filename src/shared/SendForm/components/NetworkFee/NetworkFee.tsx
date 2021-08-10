import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Spinner from '@components/Spinner'
import Tooltip from '@components/Tooltip'
import Switch from '@components/Switch'

import FeeButton from '../FeeButton'

// Utils
import { toUpper } from '@utils/format'

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
}

const NetworkFee: React.FC<Props> = (props) => {
  const { isLoading, fee, symbol, type, setType, isBalanceError, withButton } = props

  const [switchValue, setSwitchValue] = React.useState<boolean>(false)

  const onToggleSwitch = (): void => {
    setSwitchValue((prev: boolean) => !prev)
  }

  return (
    <Styles.Container>
      <FeeButton type={type} onChange={setType} />
      <Styles.IncludeBlock>
        <Styles.IncludeLabel>Include Fee</Styles.IncludeLabel>
        <Styles.SwitchRow>
          <Switch value={switchValue} onToggle={onToggleSwitch} />
        </Styles.SwitchRow>
      </Styles.IncludeBlock>
    </Styles.Container>
  )

  // return (
  //   <Styles.Container>
  //     <Styles.Row>
  //       <Styles.Label>Network fee:</Styles.Label>
  //       {isLoading ? (
  //         <Spinner size={16} />
  //       ) : (
  //         <Styles.FeeRow>
  //           <Styles.Fee isError={isBalanceError}>
  //             {fee === 0 ? '-' : `${fee} ${toUpper(symbol)}`}
  //           </Styles.Fee>
  //           {isBalanceError ? (
  //             <Styles.IconRow>
  //               <Tooltip text="Insufficient funds" mt={5}>
  //                 <SVG src="../../assets/icons/warning.svg" width={12} height={12} />
  //               </Tooltip>
  //             </Styles.IconRow>
  //           ) : null}
  //         </Styles.FeeRow>
  //       )}
  //     </Styles.Row>
  //     {withButton ? <FeeButton type={type} onChange={setType} /> : null}
  //   </Styles.Container>
  // )
}

export default NetworkFee

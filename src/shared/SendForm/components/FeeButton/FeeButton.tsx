import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Tooltip from '@components/Tooltip'
import Spinner from '@components/Spinner'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toUpper } from '@utils/format'

// Types
import { TFees } from '../../types'
import { TCustomFee } from '@utils/api/types'

// Styles
import Styles from './styles'

interface Props {
  type: TFees
  onChange: (value: TFees) => void
  isError: boolean
  isLoading: boolean
  fee: number
  withButton: boolean
  symbol: string
  customFee: TCustomFee
}

const feeTypes: TFees[] = ['slow', 'average', 'fast']

const FeeButton: React.FC<Props> = (props) => {
  const { type, onChange, isError, isLoading, fee, withButton, symbol, customFee } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const toggleVisible = (): void => {
    if (withButton) {
      setIsVisible(!isVisible)
    }
  }

  const onClickItem = (item: TFees) => (): void => {
    onChange(item)
    setIsVisible(false)
  }

  return (
    <Styles.Container ref={ref}>
      <Styles.Row onClick={toggleVisible} isVisible={isVisible} disabled={!withButton}>
        <Styles.Heading>
          <Styles.Label className="label">{withButton ? type : 'Network Fee'}</Styles.Label>
          {withButton ? (
            <SVG
              src="../../../assets/icons/dropdownArrow.svg"
              width={8}
              height={5}
              className="arrow"
            />
          ) : null}
        </Styles.Heading>
        {isLoading ? (
          <Spinner size={16} />
        ) : (
          <Styles.Body>
            <Styles.Fee isError={isError}>
              {fee === 0 ? '-' : `${fee} ${toUpper(symbol)}`}
            </Styles.Fee>
            {isError ? (
              <Styles.IconRow>
                <Tooltip text="Insufficient funds" mt={5}>
                  <SVG src="../../assets/icons/warning.svg" width={12} height={12} />
                </Tooltip>
              </Styles.IconRow>
            ) : null}
          </Styles.Body>
        )}
      </Styles.Row>
      {withButton ? (
        <Styles.List isVisible={isVisible}>
          {feeTypes
            .filter((feeType: TFees) => toUpper(feeType) !== toUpper(type))
            .map((item: TFees) => (
              <Styles.ListItem key={item} onClick={onClickItem(item)}>
                <Styles.ListItemLabel className="fee-type">{item}</Styles.ListItemLabel>
                <Styles.ListItemValue>
                  {customFee[item] || '-'} {toUpper(symbol)}
                </Styles.ListItemValue>
              </Styles.ListItem>
            ))}
        </Styles.List>
      ) : null}
    </Styles.Container>
  )
}

export default FeeButton

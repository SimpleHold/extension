import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Tooltip from '@components/Tooltip'
import Spinner from '@components/Spinner'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toLower, toUpper } from '@utils/format'
import { checkWithZeroFee } from '@utils/currencies'

// Types
import { TFeeValue } from '../types'

// Styles
import Styles from './styles'

interface Props {
  type: TFeeTypes
  onChange: (value: TFeeTypes) => void
  isError: boolean
  isLoading: boolean
  fee: number
  withButton: boolean
  symbol: string
  values: TFeeValue[]
  openFrom?: string
}

const feeTypes: TFeeTypes[] = ['slow', 'average', 'fast']

const FeeButtonShared: React.FC<Props> = (props) => {
  const { type, onChange, isError, isLoading, fee, withButton, symbol, values, openFrom } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const toggleVisible = (): void => {
    if (withButton) {
      setIsVisible(!isVisible)
    }
  }

  const onClickItem = (item: TFeeTypes) => (): void => {
    onChange(item)
    setIsVisible(false)
  }

  return (
    <Styles.Container ref={ref}>
      <Styles.Row
        onClick={toggleVisible}
        isVisible={isVisible}
        disabled={!withButton}
        openFrom={openFrom}
      >
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
              {fee === 0 && !checkWithZeroFee(symbol) ? '-' : `${fee} ${toUpper(symbol)}`}
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
        <Styles.List isVisible={isVisible} openFrom={openFrom}>
          {feeTypes
            .filter((feeType: TFeeTypes) => toUpper(feeType) !== toUpper(type))
            .map((item: TFeeTypes) => {
              const getFee = values.find((value: TFeeValue) => value.type === item)

              return (
                <Styles.ListItem key={item} onClick={onClickItem(item)} openFrom={openFrom}>
                  <Styles.ListItemLabel className="fee-type">{item}</Styles.ListItemLabel>
                  <Styles.ListItemValue>
                    {getFee?.value ? getFee.value : '-'} {toUpper(symbol)}
                  </Styles.ListItemValue>
                </Styles.ListItem>
              )
            })}
        </Styles.List>
      ) : null}
    </Styles.Container>
  )
}

export default FeeButtonShared

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

type TFeeTypes = 'slow' | 'average' | 'fast'

interface Props {
  type: TFeeTypes
  onChange: (value: TFeeTypes) => void
}

const feeTypes: TFeeTypes[] = ['slow', 'average', 'fast']

const FeeButton: React.FC<Props> = (props) => {
  const { type, onChange } = props

  const { ref, isVisible, toggle } = useVisible(false)

  const onClickItem = (item: TFeeTypes) => (): void => {
    onChange(item)
    toggle()
  }

  return (
    <Styles.Container ref={ref}>
      <Styles.Row onClick={toggle} isVisible={isVisible}>
        <Styles.Title>{type}</Styles.Title>
        <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
      </Styles.Row>
      <Styles.List isVisible={isVisible}>
        {feeTypes
          .filter((feeType: TFeeTypes) => toLower(feeType) !== toLower(type))
          .map((item: TFeeTypes) => (
            <Styles.ListItem key={item} onClick={onClickItem(item)}>
              <Styles.ListItemLabel>{item}</Styles.ListItemLabel>
            </Styles.ListItem>
          ))}
      </Styles.List>
    </Styles.Container>
  )
}

export default FeeButton

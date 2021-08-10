import * as React from 'react'
import SVG from 'react-inlinesvg'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toLower } from '@utils/format'

// Types
import { TFees } from '../../types'

// Styles
import Styles from './styles'

interface Props {
  type: TFees
  onChange: (value: TFees) => void
}

const feeTypes: TFees[] = ['slow', 'average', 'fast']

const FeeButton: React.FC<Props> = (props) => {
  const { type, onChange } = props

  const { ref, isVisible, toggle } = useVisible(false)

  const onClickItem = (item: TFees) => (): void => {
    onChange(item)
    toggle()
  }

  return (
    <Styles.Container>
      <Styles.Row>
        <Styles.Heading>
          <Styles.Label>{type}</Styles.Label>
          <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
        </Styles.Heading>
      </Styles.Row>
    </Styles.Container>
  )

  // return (
  //   <Styles.Container ref={ref}>
  //     <Styles.Row onClick={toggle} isVisible={isVisible}>
  //       <Styles.Title>{type}</Styles.Title>
  //       <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
  //     </Styles.Row>
  //     <Styles.List isVisible={isVisible}>
  //       {feeTypes
  //         .filter((feeType: TFeeTypes) => toLower(feeType) !== toLower(type))
  //         .map((item: TFeeTypes) => (
  //           <Styles.ListItem key={item} onClick={onClickItem(item)}>
  //             <Styles.ListItemLabel>{item}</Styles.ListItemLabel>
  //           </Styles.ListItem>
  //         ))}
  //     </Styles.List>
  //   </Styles.Container>
  // )
}

export default FeeButton

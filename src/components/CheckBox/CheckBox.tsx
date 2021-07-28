import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  color?: string
  iconWidth?: number
  iconHeight?: number
  isDisabled?: boolean
}

const CheckBox: React.FC<Props> = (props) => {
  const { value, onClick, color, iconWidth, iconHeight, isDisabled } = props

  return (
    <Styles.Container onClick={onClick} color={color} isDisabled={isDisabled}>
      {value ? (
        <SVG
          src="../../assets/icons/check.svg"
          width={iconWidth || 9.5}
          height={iconHeight || 7.5}
        />
      ) : null}
    </Styles.Container>
  )
}

export default CheckBox

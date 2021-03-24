import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const CheckBox: React.FC<Props> = (props) => {
  const { value, onClick } = props

  return (
    <Styles.Container onClick={onClick}>
      {value ? (
        <SVG src="../../assets/icons/check.svg" width={9.5} height={7.5} title="check" />
      ) : null}
    </Styles.Container>
  )
}

export default CheckBox

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Icons
import checkIcon from '@assets/icons/check.svg'

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
      {value ? <SVG src={checkIcon} width={9.5} height={7.5} title="check" /> : null}
    </Styles.Container>
  )
}

export default CheckBox

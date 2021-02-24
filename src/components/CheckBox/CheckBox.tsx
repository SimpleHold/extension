import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
}

const CheckBox: React.FC<Props> = (props) => {
  const { value } = props

  return <Styles.Container />
}

export default CheckBox

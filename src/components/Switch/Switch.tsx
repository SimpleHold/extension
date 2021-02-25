import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
  onToggle: Function
}

const Switch: React.FC<Props> = (props) => {
  const { value, onToggle } = props

  return <Styles.Container />
}

export default Switch

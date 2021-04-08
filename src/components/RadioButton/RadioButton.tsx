import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onToggle: () => void
}

const RadioButton: React.FC<Props> = (props) => {
  const { isActive, onToggle } = props

  return <Styles.Container onClick={onToggle}>{isActive ? <Styles.Dot /> : null}</Styles.Container>
}

export default RadioButton

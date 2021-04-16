import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Switch: React.FC<Props> = (props) => {
  const { value, onToggle } = props

  return (
    <Styles.Container onClick={onToggle} isActive={value}>
      <Styles.Dot />
    </Styles.Container>
  )
}

export default Switch

import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  value: boolean
  onToggle: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  openFrom?: string
}

const Switch: React.FC<Props> = (props) => {
  const { value, onToggle, openFrom } = props

  return (
    <Styles.Container onClick={onToggle} isActive={value} openFrom={openFrom}>
      <Styles.Dot />
    </Styles.Container>
  )
}

export default Switch

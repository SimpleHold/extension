import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
}

const RadioButton: React.FC<Props> = (props) => {
  const { isActive } = props

  return (
    <Styles.Container>
      <Styles.Dot />
    </Styles.Container>
  )
}

export default RadioButton

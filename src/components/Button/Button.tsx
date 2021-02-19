import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
}

const Button: React.FC<Props> = (props) => {
  const { label } = props

  return (
    <Styles.Container>
      <Styles.Label>{label}</Styles.Label>
    </Styles.Container>
  )
}

export default Button

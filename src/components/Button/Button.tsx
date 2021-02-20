import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Button: React.FC<Props> = (props) => {
  const { label, onClick } = props

  return (
    <Styles.Container onClick={onClick}>
      <Styles.Label>{label}</Styles.Label>
    </Styles.Container>
  )
}

export default Button

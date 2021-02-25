import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  isLight?: boolean
  isDanger?: boolean // Fix me
  mr?: number
  ml?: number
  isSmall?: boolean
  isFullDanger?: boolean // Fix me
}

const Button: React.FC<Props> = (props) => {
  const { label, onClick, disabled, isLight, isDanger, mr, ml, isSmall, isFullDanger } = props

  return (
    <Styles.Container
      onClick={onClick}
      disabled={disabled}
      mr={mr}
      ml={ml}
      isSmall={isSmall}
      isLight={isLight}
      isDanger={isDanger}
    >
      <Styles.Label>{label}</Styles.Label>
    </Styles.Container>
  )
}

export default Button

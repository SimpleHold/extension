import * as React from 'react'

// Components
import Spinner from '@components/Spinner'

// Styles
import Styles from './styles'

interface Props {
  label: string
  onClick: Function
  disabled?: boolean
  isLight?: boolean
  mr?: number
  ml?: number
  isSmall?: boolean
  isDanger?: boolean
  isLoading?: boolean
}

const Button: React.FC<Props> = (props) => {
  const { label, disabled, isLight, mr, ml, isSmall, isDanger, onClick, isLoading } = props

  const buttonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault()
    onClick()
  }

  return (
    <Styles.Container
      disabled={disabled || isLoading}
      isLight={isLight}
      mr={mr}
      ml={ml}
      isSmall={isSmall}
      isDanger={isDanger}
      onClick={buttonOnClick}
    >
      {isLoading ? <Spinner size={24} /> : <Styles.Label>{label}</Styles.Label>}
    </Styles.Container>
  )
}

export default Button

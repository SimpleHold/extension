import * as React from 'react'
import SVG from 'react-inlinesvg'

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
  isDanger?: boolean
  isLoading?: boolean
  icon?: string
  mt?: number
}

const Button: React.FC<Props> = (props) => {
  const { label, disabled, isLight, mr, ml, isDanger, onClick, isLoading, icon, mt } = props

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
      isDanger={isDanger}
      onClick={buttonOnClick}
      mt={mt}
    >
      {icon ? (
        <Styles.IconRow>
          <SVG src={icon} width={16} height={16} />
        </Styles.IconRow>
      ) : null}
      {isLoading ? <Spinner size={24} /> : <Styles.Label>{label}</Styles.Label>}
    </Styles.Container>
  )
}

export default Button

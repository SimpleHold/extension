import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import spinnerIcon from '@assets/icons/spinner.svg'

// Styles
import Styles from './styles'

interface Props {
  ml?: number
  size: number
}

const Spinner: React.FC<Props> = (props) => {
  const { ml, size } = props

  return (
    <Styles.Container ml={ml} size={size}>
      <SVG src={spinnerIcon} width={size} height={size} />
    </Styles.Container>
  )
}

export default Spinner

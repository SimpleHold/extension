import * as React from 'react'
import SVG from 'react-inlinesvg'

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
      <SVG src="../../assets/icons/spinner.svg" width={size} height={size} />
    </Styles.Container>
  )
}

export default Spinner

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import spinnerIcon from '@assets/icons/spinner.svg'

// Styles
import Styles from './styles'

interface Props {
  ml?: number
}

const Spinner: React.FC<Props> = (props) => {
  const { ml } = props

  return (
    <Styles.Container ml={ml}>
      <SVG src={spinnerIcon} width={16} height={16} title="Spinner" />
    </Styles.Container>
  )
}

export default Spinner

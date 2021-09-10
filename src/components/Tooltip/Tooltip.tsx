import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactElement<any, any> | null
  text: string
  mt?: number
  direction?: 'left' | 'right'
  maxWidth?: number
  textSpace?: string
  render?: React.ReactElement<any, any> | null
  left?: number
  arrowLeft?: number
  zIndex?: number
}

const Tooltip: React.FC<Props> = (props) => {
  const {
    children,
    text,
    mt,
    direction,
    maxWidth,
    textSpace,
    render,
    left,
    arrowLeft,
    zIndex = 2,
  } = props

  return (
    <Styles.Container mt={mt} left={left} zIndex={zIndex}>
      {children}
      <Styles.Tooltip
        className="tooltip"
        direction={direction}
        maxWidth={maxWidth}
        textSpace={textSpace}
        arrowLeft={arrowLeft}
      >
        {render || <Styles.TooltipText>{text}</Styles.TooltipText>}
      </Styles.Tooltip>
    </Styles.Container>
  )
}

export default Tooltip

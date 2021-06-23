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
}

const Tooltip: React.FC<Props> = (props) => {
  const { children, text, mt, direction, maxWidth, textSpace } = props

  return (
    <Styles.Container mt={mt}>
      {children}
      <Styles.Tooltip
        className="tooltip"
        direction={direction}
        maxWidth={maxWidth}
        textSpace={textSpace}
      >
        <Styles.TooltipText>{text}</Styles.TooltipText>
      </Styles.Tooltip>
    </Styles.Container>
  )
}

export default Tooltip

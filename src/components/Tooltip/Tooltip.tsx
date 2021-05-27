import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactElement<any, any> | null
  text: string
}

const Tooltip: React.FC<Props> = (props) => {
  const { children, text } = props

  return (
    <Styles.Container>
      {children}
      <Styles.Tooltip className="tooltip">
        <Styles.TooltipText>{text}</Styles.TooltipText>
      </Styles.Tooltip>
    </Styles.Container>
  )
}

export default Tooltip

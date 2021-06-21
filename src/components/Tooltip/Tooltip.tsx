import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactElement<any, any> | null
  text: string
  mt?: number
}

const Tooltip: React.FC<Props> = (props) => {
  const { children, text, mt } = props

  return (
    <Styles.Container mt={mt}>
      {children}
      <Styles.Tooltip className="tooltip">
        <Styles.TooltipText>{text}</Styles.TooltipText>
      </Styles.Tooltip>
    </Styles.Container>
  )
}

export default Tooltip

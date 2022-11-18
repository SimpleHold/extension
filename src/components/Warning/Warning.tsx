import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import warningIcon from '@assets/icons/warning.svg'

// Styles
import Styles from './styles'

interface Props {
  text: string
  color?: string
  br?: number
  mt?: number
  padding?: string
  background?: string
}

const Warning: React.FC<Props> = (props) => {
  const { text, color, br, mt, padding, background } = props

  return (
    <Styles.Container mt={mt} br={br} color={color} padding={padding} background={background}>
      <Styles.IconRow>
        <SVG src={warningIcon} width={15} height={15} />
      </Styles.IconRow>
      <Styles.Text>{text}</Styles.Text>
    </Styles.Container>
  )
}

export default Warning

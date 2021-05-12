import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

interface Props {
  text: string
}

const Warning: React.FC<Props> = (props) => {
  const { text } = props

  return (
    <Styles.Container>
      <Styles.IconRow>
        <SVG src="../../assets/icons/warning.svg" width={15} height={15} />
      </Styles.IconRow>
      <Styles.Text>{text}</Styles.Text>
    </Styles.Container>
  )
}

export default Warning

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import newWarningIcon from '@assets/icons/newWarning.svg'

// Styles
import Styles from './styles'

interface Props {
  text: string
  mt?: number
}

const FilledWarning: React.FC<Props> = (props) => {
  const { text, mt = 0 } = props

  return (
    <Styles.Container style={{ marginTop: mt }}>
      <Styles.Icon>
        <SVG src={newWarningIcon} width={20} height={20} />
      </Styles.Icon>
      <Styles.Text>{text}</Styles.Text>
    </Styles.Container>
  )
}

export default FilledWarning

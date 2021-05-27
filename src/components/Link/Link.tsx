import * as React from 'react'
import SVG from 'react-inlinesvg'

// Utils
import { openWebPage } from '@utils/extension'

// Styles
import Styles from './styles'

interface Props {
  to: string
  title: string
  mt?: number
}

const Link: React.FC<Props> = (props) => {
  const { to, title, mt = 0 } = props

  return (
    <Styles.Container onClick={() => openWebPage(to)} mt={mt}>
      <Styles.IconRow>
        <SVG src="../../assets/icons/ask.svg" width={15} height={15} title="ask" />
      </Styles.IconRow>
      <Styles.Title>{title}</Styles.Title>
    </Styles.Container>
  )
}

export default Link

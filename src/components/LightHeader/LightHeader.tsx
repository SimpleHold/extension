import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import backArrowIcon from '@assets/icons/backArrow.svg'

// Styles
import Styles from './styles'

interface Props {
  title: string
  onBack: () => void
}

const LightHeader: React.FC<Props> = (props) => {
  const { title, onBack } = props

  return (
    <Styles.Container>
      <Styles.Button onClick={onBack}>
        <SVG src={backArrowIcon} width={24} height={24} />
      </Styles.Button>
      <Styles.Title>{title}</Styles.Title>
      <Styles.Button disabled />
    </Styles.Container>
  )
}

export default React.memo(LightHeader)

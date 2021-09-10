import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import sortArrow from '@assets/icons/sortArrow.svg'

// Styles
import Styles from './styles'

interface Props {
  title: string
  width: number
  type: 'asc' | 'desc' | null
  values: {
    asc: string
    desc: string
  }
  onClick: () => void
}

const SortButton: React.FC<Props> = (props) => {
  const { title, width, type, values, onClick } = props

  return (
    <Styles.Container width={width} onClick={onClick}>
      <Styles.Title>{type ? values[type] : title}</Styles.Title>
      <Styles.Arrows type={type}>
        <SVG src={sortArrow} width={8} height={6} />
        <SVG src={sortArrow} width={8} height={6} />
      </Styles.Arrows>
    </Styles.Container>
  )
}

export default SortButton

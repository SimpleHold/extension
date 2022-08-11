import * as React from 'react'
import SVG from 'react-inlinesvg'

// Styles
import Styles from './styles'

interface Props {
  onClick: () => void
  invertColors?: boolean
  isFiltersActive: boolean
}

const FiltersButton: React.FC<Props> = ({ onClick, isFiltersActive, invertColors = false }) => {

  return (
    <Styles.Container invertColors={invertColors} onClick={onClick}>
      <SVG src="../../assets/icons/sortNew.svg" width={18} height={14} />
      {isFiltersActive ? <Styles.FiltersActiveDot /> : null}
    </Styles.Container>
  )
}

export default FiltersButton

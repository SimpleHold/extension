import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import sortNewIcon from '@assets/icons/sortNew.svg'

// Styles
import Styles from './styles'

interface Props {
  onClick: () => void
  invertColors?: boolean
  isFiltersActive: boolean
}

const FiltersButton: React.FC<Props> = ({ onClick, isFiltersActive, invertColors = false }) => (
  <Styles.Container invertColors={invertColors} onClick={onClick}>
    <SVG src={sortNewIcon} width={18} height={14} />
    {isFiltersActive ? <Styles.FiltersActiveDot /> : null}
  </Styles.Container>
)

export default FiltersButton

import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
}

const SortWalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  return (
    <DrawerWrapper title="Sort by" isActive={isActive} onClose={onClose}>
      <p>Sort by</p>
    </DrawerWrapper>
  )
}

export default SortWalletsDrawer

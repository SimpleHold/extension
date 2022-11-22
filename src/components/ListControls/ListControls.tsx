import * as React from 'react'

// Assets
import MenuSwitch from '@components/MenuSwitch'
import AddWalletButton from '@components/AddWalletButton'
import FiltersButton from '@components/FiltersButton'

// Styles
import Styles from './styles'

export interface TListControlsProps {
  onSwitch: () => void
  openFilters: () => void
  showNft: boolean
  isFiltersActive: boolean
  isCollapsed?: boolean
  onAddNewAddress: () => void
}

const ListControls: React.FC<TListControlsProps> = (props) => {
  const { onSwitch, openFilters, isFiltersActive, isCollapsed, onAddNewAddress, showNft } = props

  return (
    <Styles.Container isCollapsed={isCollapsed}>
      <Styles.ControlsLeft>
        <MenuSwitch isRightPosition={showNft} isCollapsed={isCollapsed} onSwitch={onSwitch} />
      </Styles.ControlsLeft>
      <Styles.ControlsRight>
        <FiltersButton
          isFiltersActive={isFiltersActive}
          onClick={openFilters}
          invertColors={isCollapsed}
        />
        <AddWalletButton onClick={onAddNewAddress} minimize={!isCollapsed} />
      </Styles.ControlsRight>
    </Styles.Container>
  )
}

export default ListControls

import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import walletIcon from "@assets/icons/listControlsWalletIcon.svg"
import nftIcon from "@assets/icons/listControlsNftIcon.svg"

// Styles
import Styles from './styles'

interface Props {
  isRightPosition: boolean
  onSwitch: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isCollapsed?: boolean
}

const MenuSwitch: React.FC<Props> = ({ isRightPosition, onSwitch, isCollapsed }) => {

  return (
    <Styles.Container onClick={onSwitch} isCollapsed={isCollapsed} isRightPosition={isRightPosition}>
      {isCollapsed
        ? <Styles.Icon isCollapsed={isCollapsed} isActive={!isRightPosition}>
          <SVG src={walletIcon} />
        </Styles.Icon>
        : <Styles.Title isActive={!isRightPosition}>Wallets</Styles.Title>
      }
      {isCollapsed
        ? <Styles.Icon isCollapsed={isCollapsed} isActive={isRightPosition}>
          <SVG src={nftIcon} />
        </Styles.Icon>
        :<Styles.Title isActive={isRightPosition}>NFTs</Styles.Title>
      }

      <Styles.Thumb className={'thumb'} isCollapsed={isCollapsed}/>
    </Styles.Container>
  )
}

export default MenuSwitch

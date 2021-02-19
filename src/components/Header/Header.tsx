import * as React from 'react'
import SVG from 'react-inlinesvg'

// Icons
import lockIcon from '@assets/icons/lock.svg'
import settingsIcon from '@assets/icons/settings.svg'

// Styles
import Styles from './styles'

const Header: React.FC = () => (
  <Styles.Container>
    <Styles.Logo />
    <Styles.Nav>
      <Styles.NavItem>
        <SVG src={lockIcon} width={14} height={18} title="lock" />
      </Styles.NavItem>
      <Styles.NavItem>
        <SVG src={settingsIcon} width={16} height={16} title="settings" />
      </Styles.NavItem>
    </Styles.Nav>
  </Styles.Container>
)

export default Header

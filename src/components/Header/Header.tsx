import * as React from 'react';

// Styles
import Styles from './styles';

const Header: React.FC = () => (
  <Styles.Container>
    <Styles.Logo />
    <Styles.Nav>
      <Styles.NavItem>
        <Styles.NavItemIcon />
      </Styles.NavItem>
      <Styles.NavItem>
        <Styles.NavItemIcon />
      </Styles.NavItem>
    </Styles.Nav>
  </Styles.Container>
);

export default Header;

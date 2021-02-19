import styled from 'styled-components'

import logo from '../../assets/logo.svg'

const Container = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Logo = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${logo});
  background-repeat: no-repeat;
  background-size: contain;
`

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
`

const NavItem = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:last-child) {
    margin: 0 10px 0 0;
  }

  &:hover {
    cursor: pointer;
    background-color: #ffffffcc;
    border-radius: 15px;

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
  Logo,
  Nav,
  NavItem,
}

export default Styles

import styled from 'styled-components'

import logo from '../../assets/logo.svg'

const Container = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
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

const Navigate = styled.div`
  margin: 0 0 0 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BackIcon = styled.div`
  width: 6px;
  height: 10px;
  background-color: red;
  margin: 0 10px 0 0;
`

const NavigateTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.6;
`

const Styles = {
  Container,
  Row,
  Logo,
  Nav,
  NavItem,
  Navigate,
  BackIcon,
  NavigateTitle,
}

export default Styles

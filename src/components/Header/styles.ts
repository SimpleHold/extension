import styled from 'styled-components'

type TLogoProps = {
  color: string
}

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
  width: 30px;
  height: 30px;

  path {
    fill: ${({ color }: TLogoProps) => color};
  }
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

const LogoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Name = styled.div`
  margin: 0 0 0 10px;
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
  LogoRow,
  Name,
}

export default Styles

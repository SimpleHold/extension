import styled from 'styled-components'

type TContainerProps = {
  withBorder?: boolean
}

type TLogoProps = {
  color: string
}

type TNavItemProps = {
  isActive?: boolean
}

const Container = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: ${({ withBorder }: TContainerProps) =>
    withBorder ? '0.5px solid #EAEAEA' : 'none'};
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
  background-color: ${({ isActive }: TNavItemProps) => (isActive ? '#ffffffcc' : 'none')};
  border-radius: 15px;

  path {
    fill: ${({ isActive }: TNavItemProps) => (isActive ? '#3fbb7d' : '#FFFFFF')};
  }

  &:not(:last-child) {
    margin: 0 10px 0 0;
  }

  &:hover {
    cursor: ${({ isActive }: TNavItemProps) => (isActive ? 'default' : 'pointer')};
    background-color: #ffffffcc;

    path {
      fill: #3fbb7d;
    }
  }
`

const Navigate = styled.div`
  margin: 0 0 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  path {
    fill: #ffffff;
    opacity: 0.6;
  }

  &:hover {
    cursor: pointer;

    p,
    path {
      opacity: 1;
    }
  }
`

const BackIconRow = styled.div`
  width: 14px;
  height: 14px;
  margin: 0 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
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

const Styles = {
  Container,
  Row,
  Logo,
  Nav,
  NavItem,
  Navigate,
  BackIconRow,
  NavigateTitle,
  LogoRow,
}

export default Styles

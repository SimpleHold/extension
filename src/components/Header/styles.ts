import styled from 'styled-components'

type TContainerProps = {
  withBorder?: boolean
  borderColor?: string
  isAbsolute?: boolean
}

type TLogoProps = {
  whiteLogo?: boolean
}

type TNavItemProps = {
  isActive?: boolean
}

const Container = styled.div`
  padding: 15px 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom: ${({ withBorder, borderColor }: TContainerProps) =>
    withBorder ? `0.5px solid ${borderColor || '#EAEAEA'}` : 'none'};
  z-index: 100;
  position: ${({ isAbsolute }: TContainerProps) => (isAbsolute ? 'absolute' : 'relative')};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  overflow: hidden;
`

const Logo = styled.div`
  width: 30px;
  height: 30px;

  path {
    fill: ${({ whiteLogo }: TLogoProps) => whiteLogo && '#fff'};

    &:nth-child(2) {
      opacity: ${({ whiteLogo }: TLogoProps) => (whiteLogo ? 0.38 : 1)};
    }
    &:nth-child(3) {
      opacity: ${({ whiteLogo }: TLogoProps) => (whiteLogo ? 0.68 : 1)};
    }
    &:nth-child(4) {
      opacity: ${({ whiteLogo }: TLogoProps) => (whiteLogo ? 0.49 : 1)};
    }
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
    fill: ${({ isActive }: TNavItemProps) => (isActive ? '#3fbb7d' : '#C5EBD8')};
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
  overflow: hidden;

  * {
    transition: 0.2s ease;
  }

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
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  opacity: 0.6;
  text-overflow: ellipsis;
  overflow: hidden;
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

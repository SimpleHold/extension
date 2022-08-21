import styled from 'styled-components'

import background from '@assets/backgrounds/mainBgNew.png'

type TLinkProps = {
  isActive?: boolean
}

const Container = styled.div`
  width: 100%;
  background-image: url(${background});
  background-repeat: no-repeat;
  position: fixed;
  z-index: 2;
  
  &,* {
    transition: 0.5s ease;
  }
`

const Row = styled.div`
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Balance = styled.p`
  margin: 0;
  color: #ffffff;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 34px;
  line-height: 36px;
`

const ClockIcon = styled.div`
  opacity: 0.5;
`

const Estimated = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  span {
    margin: 0;
    display: flex;
    justify-content: center;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 19px;
    line-height: 25px;
    text-align: center;
    color: #C5EBD8;
    &.usdSign {
      font-family: Roboto, sans-serif;
      margin-right: 4px;
    }
  }
  
`

const TotalBalanceLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  position: absolute;
  user-select: none;
`

const PendingBalanceRow = styled.div`
  display: flex;
  justify-content: center;
  transition: 0.3s ease;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 60px);
  justify-content: space-between;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Button = styled.div`
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
  width: 40px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:not(:last-child) {
    margin: 0 10px 0 0;
  }

  path {
    fill: #ffffff;
  }

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.8);

    path {
      fill: #3fbb7d;
    }
  }
`

const ButtonDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #eb5757;
  position: absolute;
  top: 6px;
  right: 8px;
  border-radius: 3px;
`

const Nav = styled.div`
  transition: 0.3s ease;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Link = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ isActive }: TLinkProps) => (isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)')};
  margin: 0;

  &:hover {
    cursor: ${({ isActive }: TLinkProps) => (isActive ? 'default' : 'pointer')};
    color: #ffffff;
  }
`

const LinkDivider = styled.p`
  margin: 0 3px 0 5px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.5);
`

const Styles = {
  Container,
  Row,
  BalanceRow,
  Balance,
  ClockIcon,
  Estimated,
  TotalBalanceLabel,
  PendingBalanceRow,
  Bottom,
  Actions,
  Button,
  ButtonDot,
  Nav,
  Link,
  LinkDivider,
}

export default Styles

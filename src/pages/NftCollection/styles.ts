import styled from 'styled-components'

import nftNotFoundIcon from '@assets/icons/nftNotFound.svg'

type TLinkProps = {
  isActive?: boolean
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Tabs = styled.div`
  padding: 10px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`

const Nav = styled.div`
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

const Container = styled.div`
  border-radius: 16px 16px 0 0;
  background-color: #fff;
  height: 540px;
  padding: 12px 16px 0;
`

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 110px 32px 0 32px;
`

const NotFoundIcon = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${nftNotFoundIcon});
  background-repeat: no-repeat;
  background-size: contain;
`

const NotFoundText = styled.p`
  margin: 20px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
`

const Loading = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -7.5px;
`

const Content = styled.div`
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  margin: 0 -7.5px;
  height: 470px;
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

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`

const Styles = {
  Wrapper,
  Tabs,
  Nav,
  Link,
  LinkDivider,
  Button,
  Container,
  NotFound,
  NotFoundIcon,
  NotFoundText,
  Loading,
  Content,
  ButtonDot,
  Controls,
}

export default Styles

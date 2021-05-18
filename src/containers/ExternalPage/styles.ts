import styled from 'styled-components'

import lockIllustrate from '@assets/illustrate/lock.svg'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
`

const Extension = styled.div`
  width: 375px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0px 5px 15px rgba(125, 126, 141, 0.15);
  border-radius: 16px;
  height: 700px;
  overflow: hidden;
  filter: drop-shadow(0px 5px 15px rgba(125, 126, 141, 0.15));
`

const Header = styled.div`
  padding: 15px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;

  path {
    fill: #ffffff;
  }
`

const CloseButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
    background-color: rgb(255 255 255 / 80%);

    path {
      fill: #3fbb7d;
    }
  }
`

const Body = styled.div`
  background-color: #ffffff;
  height: 640px;
`

const LockedRow = styled.div`
  padding: 50px 30px 0 30px;
`

const LockImage = styled.div`
  width: 315px;
  height: 180px;
  background-image: url(${lockIllustrate});
  background-repeat: no-repeat;
  background-size: contain;
`

const LockedTitle = styled.p`
  margin: 30px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const LockedForm = styled.form`
  margin: 20px 0 0 0;
`

const LockedFormActions = styled.div`
  margin: 5px 0 0 0;
`

const Styles = {
  Wrapper,
  Extension,
  Header,
  Logo,
  CloseButton,
  Body,
  LockedRow,
  LockImage,
  LockedTitle,
  LockedForm,
  LockedFormActions,
}

export default Styles

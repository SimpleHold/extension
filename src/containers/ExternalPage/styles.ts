import styled from 'styled-components'

import lockIllustrate from '@assets/illustrate/lock.svg'

type THeaderRowProps = {
  withBack: boolean
}

type TExtensionProps = {
  height?: string
}

type TLogoProps = {
  headerStyle: 'white' | 'green'
}

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
  height: ${({ height }: TExtensionProps) => height || '698px'};
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

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: ${({ withBack }: THeaderRowProps) => (withBack ? 'space-between' : 'flex-end')};
`

const HeaderBackRow = styled.div`
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

const HeaderBackIconRow = styled.div`
  width: 14px;
  height: 14px;
  margin: 0 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderBackTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  opacity: 0.6;
`

const Logo = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;

  path {
    fill: ${({ headerStyle }: TLogoProps) => (headerStyle === 'green' ? '#ffffff' : '#3fbb7d')};
  }
`

const CloseButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;

  path {
    fill: ${({ headerStyle }: TLogoProps) => (headerStyle === 'green' ? '#ffffff' : '#cccccc')};
  }

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
  HeaderRow,
  HeaderBackRow,
  HeaderBackIconRow,
  HeaderBackTitle,
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

import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  padding: 80px 0;
`

const Extension = styled.div`
  width: 375px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0px 5px 15px rgba(125, 126, 141, 0.15);
  border-radius: 16px;
`

const Header = styled.div`
  padding: 18px 20px 18px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const LogoRow = styled.div`
  width: 30px;
  height: 24px;

  path {
    fill: #3fbb7d;
  }
`

const CloseIconRow = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #cccccc;
  }

  &:hover {
    cursor: pointer;
  }
`

const Body = styled.div`
  padding: 40px 30px;
`

const Title = styled.h1`
  margin: 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: #1d1d22;
`

const DNDArea = styled.div`
  padding: 35px 32.5px 45px 32.5px;
  background-color: #f8f8f8;
  border: 1px dashed #cccccc;
  border-radius: 5px;
  margin: 30px 0 0 0;
`

const Styles = {
  Wrapper,
  Extension,
  Header,
  LogoRow,
  CloseIconRow,
  Body,
  Title,
  DNDArea,
}

export default Styles

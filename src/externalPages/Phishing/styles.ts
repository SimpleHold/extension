import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 40px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Logo = styled.div`
  width: 161px;
  height: 24px;
  background-color: red;
`

const Warning = styled.div`
  width: 800px;
  background-color: #d3ecdd;
  border-radius: 16px;
  margin: 30px 0 0 0;
`

const WarningRow = styled.div`
  padding: 50px 150px 60px 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Image = styled.div`
  width: 384px;
  height: 130px;
  background-color: red; ;
`

const Title = styled.h1`
  margin: 30px 0 0 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  text-align: center;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #1d1d22;
`

const WarningFooter = styled.div`
  padding: 20px 40px;
  border-top: 1px solid #ffffff;
`

const AdvancedButton = styled.div`
  padding: 12px 20px;
`

const AdvancedButtonTitle = styled.p``

const Styles = {
  Wrapper,
  Logo,
  Warning,
  WarningRow,
  Image,
  Title,
  Description,
  WarningFooter,
  AdvancedButton,
  AdvancedButtonTitle,
}

export default Styles

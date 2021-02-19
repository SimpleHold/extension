import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
`

const Row = styled.div`
  padding: 20px 30px 40px 40px;
`

const PageTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`

const Balance = styled.p`
  margin: 21px 0 0 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 42px;
  color: #1d1d22;
`

const USDEstimated = styled.p`
  margin: 5px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.div`
  padding: 20px 30px 30px 30px;
  background-color: #f8f8f8;
  border-top: 1px solid #eaeaea;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  PageTitle,
  Balance,
  USDEstimated,
  Form,
}

export default Styles

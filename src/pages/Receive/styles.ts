import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 16px 16px 0px 0px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  overflow: hidden;
`

const Row = styled.div`
  position: relative;
`

const Receive = styled.div`
  width: 100%;
  min-height: 290px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  word-break: break-all;
`

const Address = styled.p`
  margin: 16px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
`

const Warning = styled.p`
  margin: 20px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #7d7e8d;
`

const GenerateExtraId = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Receive,
  Address,
  Warning,
  GenerateExtraId,
}

export default Styles

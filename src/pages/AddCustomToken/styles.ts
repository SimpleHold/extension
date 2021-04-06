import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 30px 30px 55px 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
`

const TokenCard = styled.div`
  margin: 20px 0 0 0;
  background-color: #f8f8f8;
  border-radius: 5px;
  padding: 15px 20px 20px 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`

const TokenCardRow = styled.div`
  margin: 0 0 0 10px;
`

const TokenName = styled.p`
  margin: 6px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  color: #1d1d22;
`

const TokenTicker = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  color: #7d7e8d;
`

const TokenDecimalLabel = styled.p`
  margin: 0 3px 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #c3c3c3;
`

const Form = styled.form`
  padding: 20px 30px 30px 30px;
  border-top: 1px solid #eaeaea;
  background-color: #f8f8f8;
`

const ButtonRow = styled.div`
  margin: 60px 0 0 0;
`

const DecimalRow = styled.div`
  margin: 17px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TokenDecimal = styled(TokenDecimalLabel)`
  margin: 0;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  TokenCard,
  TokenCardRow,
  TokenName,
  TokenTicker,
  TokenDecimalLabel,
  Form,
  ButtonRow,
  DecimalRow,
  TokenDecimal,
}

export default Styles

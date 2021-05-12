import styled from 'styled-components'

const Container = styled.div`
  border-bottom: 1px solid #eaeaea;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Row = styled.div`
  margin: 0 0 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const Info = styled.div`
  flex: 1;
`

const TokenName = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #1d1d22;
`

const TokenSymbol = styled.p`
  margin: 7px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const Button = styled.div``

const Styles = {
  Container,
  Row,
  Info,
  TokenName,
  TokenSymbol,
  Button,
}

export default Styles

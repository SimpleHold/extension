import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
`

const ReceiveBlock = styled.div`
  border-top: 1px solid #eaeaea;
  padding: 20px 30px 30px 30px;
  background-color: #f8f8f8;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Row = styled.div`
  padding: 16px 30px 40px 30px;
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const UpdateBalanceBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BalanceLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`

const RefreshIconRow = styled.div`
  width: 24px;
  height: 24px;
  background-color: #c3c3c3;
  border-radius: 12px;
  margin: 0 0 0 10px;
`

const RefreshIcon = styled.div``

const MoreButton = styled.div`
  width: 30px;
  height: 30px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MoreIcon = styled.div`
  width: 16px;
  height: 2px;
  background-color: blue;
`

const CurrencyBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 21px 0 0 0;
`

const CurrencyName = styled.p`
  margin: 0 0 0 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #f7931a;
`

const QRCode = styled.div`
  width: 120px;
  height: 120px;
  background-color: red;
`

const Address = styled.p`
  margin: 10px 0 40px 0;
  font-size: 20px;
  line-height: 25px;
  text-align: center;
  color: #7d7e8d;
  word-break: break-all;
`

const Balance = styled.p`
  margin: 10px 0 0 0;
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

const Styles = {
  Wrapper,
  Container,
  Row,
  ReceiveBlock,
  UpdateBalanceBlock,
  BalanceLabel,
  Heading,
  RefreshIconRow,
  RefreshIcon,
  MoreButton,
  MoreIcon,
  CurrencyBlock,
  CurrencyName,
  QRCode,
  Address,
  Balance,
  USDEstimated,
}

export default Styles

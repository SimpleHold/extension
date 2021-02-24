import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  margin: 0 0 10px 0;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    margin: 0 -10px 10px 10px;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin: 0 0 0 20px;
`

const Info = styled.div``

const CurrencyName = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  color: #1d1d22;
`

const Address = styled.p`
  margin: 6px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #c3c3c3;
  width: 100px; // Fix me
  overflow: hidden; // Fix me
`

const BalanceInfo = styled.div``

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  text-transform: capitalize;
  color: #1d1d22;
`

const USDEstimated = styled.p`
  margin: 6px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  Info,
  CurrencyName,
  Address,
  BalanceInfo,
  Balance,
  USDEstimated,
}

export default Styles

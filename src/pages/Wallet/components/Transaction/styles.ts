import styled from 'styled-components'

const Container = styled.div`
  height: 80px;
  margin: 0 0 0 30px;
  border-bottom: 1px solid rgba(222, 225, 233, 0.5);
  padding: 20px 28px 20px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
`

const Info = styled.div`
  display: flex;
  align-items: center;
`

const DestinationType = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(211, 236, 221, 0.7);
  border-radius: 14px;
`

const InfoRow = styled.div`
  margin: 0 0 0 10px;
`

const DestinationAddress = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
`

const Date = styled.p`
  margin: 3px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Amounts = styled.div``

const CurrencyAmount = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  text-transform: capitalize;
  color: #1d1d22;
`

const USDAmount = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Info,
  DestinationType,
  InfoRow,
  DestinationAddress,
  Date,
  Amounts,
  CurrencyAmount,
  USDAmount,
}

export default Styles

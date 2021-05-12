import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    margin: 0 -10px 10px 10px;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin: 0 0 0 10px;
`

const AddressInfo = styled.div`
  overflow: hidden;
`

const Currency = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Address = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 9px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #c3c3c3;
`

const Balances = styled.div`
  p {
    text-align: right;
  }
`

const Balance = styled.p`
  white-space: pre;
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 9px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const PendingIcon = styled.div`
  margin: 0 5px 0 0;

  svg {
    path {
      fill: rgba(195, 195, 195, 0.6);
    }
  }
`

const Styles = {
  Container,
  Row,
  AddressInfo,
  Currency,
  Address,
  Balances,
  Balance,
  Estimated,
  BalanceRow,
  PendingIcon,
}

export default Styles

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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin: 0 0 0 10px;
`

const AddressInfo = styled.div`
  width: 94px;
  overflow: hidden;

  p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

const Currency = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Address = styled.p`
  margin: 9px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #c3c3c3;
`

const Balances = styled.div`
  width: 106px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

const Balance = styled.p`
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

const Styles = {
  Container,
  Row,
  AddressInfo,
  Currency,
  Address,
  Balances,
  Balance,
  Estimated,
}

export default Styles

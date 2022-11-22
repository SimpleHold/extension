import styled from 'styled-components'

const Container = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px 0px 4px rgb(0 0 0 / 15%);
  border-radius: 12px;

  &.active {
    &:hover {
      cursor: pointer;
    }
  }
`

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 0 16px;
`

const Left = styled.div``

const Name = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 17px;
  line-height: 21px;
  color: #1d1d22;
`

const Address = styled.p`
  margin: 3px 0 0 0;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #b0b0bd;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Symbol = styled.p`
  margin: 0 0 0 2px;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #1d1d22;
  text-transform: uppercase;
`

const Estimated = styled.p`
  margin: 5px 0 0 0;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #b0b0bd;
`

const Styles = {
  Container,
  Row,
  Left,
  Name,
  Address,
  Right,
  BalanceRow,
  Balance,
  Symbol,
  Estimated,
}

export default Styles

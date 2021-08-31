import styled from 'styled-components'

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
    background-color: #f8f9fb;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 15px;
  flex: 1;
`

const Currency = styled.div`
  flex: 1;
`

const WalletNameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const WalletName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Address = styled.p`
  margin: 5px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const CheckBoxRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Styles = {
  Container,
  Row,
  Currency,
  WalletNameRow,
  WalletName,
  Address,
  CheckBoxRow,
}

export default Styles

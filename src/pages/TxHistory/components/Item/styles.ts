import styled from 'styled-components'

const Container = styled.div`
  padding: 15px 30px 15px 0;
  margin: 0 0 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 15px;
  justify-content: space-between;
  flex: 1;
`

const AddressInfo = styled.div``

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Hash = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
`

const WalletName = styled.p`
  margin: 3px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Amount = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  AddressInfo,
  Balances,
  Hash,
  WalletName,
  Amount,
  Estimated,
}

export default Styles

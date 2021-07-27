import styled from 'styled-components'

const Container = styled.div``

const Row = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Info = styled.div`
  flex: 1;
  margin: 0 0 0 15px;
`

const WalletNameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const WalletName = styled.p`
  margin: 0 6px 0 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
`

const ArrowIcon = styled.div`
  width: 10px;
  height: 6px;
  background-color: red;
`

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0 0 0;
`

const Balance = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  margin: 0;
`

const Estimated = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Styles = {
  Container,
  Row,
  Info,
  WalletNameRow,
  WalletName,
  ArrowIcon,
  Balances,
  Balance,
  Estimated,
}

export default Styles

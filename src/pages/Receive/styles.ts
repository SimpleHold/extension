import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 100%;
`

const Wallet = styled.div`
  padding: 20px 20px 56px 20px;
`

const AddressInfo = styled.div`
  border-top: 1px solid #eaeaea;
  background-color: #f8f8f8;
  height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Address = styled.p`
  margin: 20px 0 30px 0;
  font-size: 20px;
  line-height: 25px;
  text-align: center;
  color: #7d7e8d;
`

const Actions = styled.div`
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

const UpdateBalanceLabel = styled.p`
  margin: 0;
  line-height: 19px;
  color: #c3c3c3;
`

const UpdateBalanceIcon = styled.div`
  margin: 0 0 0 10px;
  width: 24px;
  height: 24px;
  background-color: #c3c3c3;
  border-radius: 15px;
`

const More = styled.div`
  width: 30px;
  height: 30px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MoreIcon = styled.div`
  width: 20px;
  height: 2.22px;
  background-color: green;
`

const Currency = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 24px 0 0 0;
`

const CurrenyName = styled.p`
  margin: 0 0 0 7px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #f7931a;
`

const Balance = styled.h3`
  margin: 11px 0 3px 0;
  font-weight: 500;
  font-size: 40px;
  line-height: 47px;
  color: #1d1d22;
`

const USDEstimated = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Wallet,
  AddressInfo,
  Address,
  Actions,
  UpdateBalanceBlock,
  UpdateBalanceLabel,
  UpdateBalanceIcon,
  More,
  MoreIcon,
  Currency,
  CurrenyName,
  Balance,
  USDEstimated,
}

export default Styles

import styled from 'styled-components'

const Container = styled.div``

const Body = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #f2f4f8;
`

const ActionButton = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
  }

  &:not(:first-child) {
    border-left: 1px solid #f2f4f8;
  }

  &:first-child {
    border-radius: 0 0 0 16px;
  }

  &:last-child {
    border-radius: 0 0 16px 0;
  }
`

const ActionName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
`

const WalletInfo = styled.div`
  margin: 0 0 0 17px;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Balance = styled.p`
  font-weight: 500;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
  margin: 0 8px 0 0;
`

const RefreshIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: red;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Body,
  Actions,
  ActionButton,
  ActionName,
  WalletInfo,
  BalanceRow,
  Balance,
  RefreshIcon,
  Estimated,
}

export default Styles

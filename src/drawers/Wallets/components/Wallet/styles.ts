import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
    background-color: #f8f9fb;

    .wallet-name {
      color: #3fbb7d;
    }

    .hardware-icon {
      path {
        fill: #3fbb7d;
      }
    }
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin: 0 0 0 15px;
  flex: 1;
`

const WalletInfo = styled.div`
  overflow: hidden;
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
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Address = styled.p`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const HardwareIconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px 0 0;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PendingIcon = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 4px 0 0;

  path {
    fill: rgba(195, 195, 195, 0.6);
  }
`

const Styles = {
  Container,
  Row,
  WalletInfo,
  WalletNameRow,
  WalletName,
  Address,
  Balances,
  Balance,
  Estimated,
  HardwareIconRow,
  BalanceRow,
  PendingIcon,
}

export default Styles

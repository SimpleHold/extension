import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin: 0 0 6px 0;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;

  &:hover {
    cursor: pointer;
    margin: 0 -10px 6px 10px;

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
`

const AddressInfo = styled.div`
  overflow: hidden;
`

const CurrencyInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HardwareIconRow = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 4px 0 0;
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

const Address = styled.div`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  text-overflow: ellipsis;
  overflow: hidden;
`

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
  white-space: pre;
`

const Estimated = styled.p`
  margin: 7px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  AddressInfo,
  CurrencyInfo,
  HardwareIconRow,
  WalletName,
  Address,
  Balances,
  BalanceRow,
  PendingIcon,
  Balance,
  Estimated,
}

export default Styles

import styled from 'styled-components'

type TRowProps = {
  gridColumns: string
}

const Wrapper = styled.div`
  &:hover {
    .container {
      cursor: pointer;
      margin: 0 -5px 6px 5px;

      .wallet-name {
        color: #3fbb7d;
      }

      .hardware-icon {
        path {
          fill: #3fbb7d;
        }
      }
    }
  }
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin: 0 0 6px 0;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  user-select: none;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ gridColumns }: TRowProps) => gridColumns};
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
  color: #1d1d22;
  font-family: Inter, sans-serif;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
`

const Address = styled.p`
  margin: 7px 0 0 0;
  font-family: Inter, sans-serif;
  text-overflow: ellipsis;
  overflow: hidden;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #B0B0BD;
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
  width: 16px;
  height: 16px;
  margin: 0 0 0 2px;

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
  font-family: Inter, sans-serif;
  font-style: normal;
`

const Estimated = styled.p`
  margin: 7px 0 0 0;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  text-align: right;
  color: #B0B0BD;
`

const ActivateBlock = styled.div`
  padding: 2px 8px;
  background-color: #e9f7f0;
  border-radius: 5px;
  margin: 5px 0 0 0;
  width: fit-content;
`

const ActivateLabel = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #3fbb7d;
`

const AddressRow = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
`

const Styles = {
  Wrapper,
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
  ActivateBlock,
  ActivateLabel,
  AddressRow
}

export default Styles

import styled from 'styled-components'

type TBodyProps = {
  pb: number
}

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin: 0 0 6px 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    margin: 0 -10px 6px 10px;
  }
`

const Body = styled.div`
  padding: 20px;
  padding-bottom: ${({ pb }: TBodyProps) => `${pb}px`};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Footer = styled.div`
  padding: 0 10px 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const HardwareBlock = styled.div`
  padding: 6px 10px;
  background-color: #f8f8f8;
  border-radius: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HardwareLabel = styled.p`
  margin: 0 0 0 6px;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
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

const Currency = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Address = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  p {
    text-align: right;
  }
`

const Balance = styled.p`
  white-space: pre;
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const PendingIcon = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 5px 0 0;

  svg {
    path {
      fill: rgba(195, 195, 195, 0.6);
    }
  }
`

const Styles = {
  Container,
  Body,
  Footer,
  HardwareBlock,
  HardwareLabel,
  Row,
  AddressInfo,
  Currency,
  Address,
  Balances,
  Balance,
  Estimated,
  BalanceRow,
  PendingIcon,
}

export default Styles

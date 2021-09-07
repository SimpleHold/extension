import styled from 'styled-components'

type TContainerProps = {
  disabled?: boolean
}

type TAmountProps = {
  amount: number
}

const Container = styled.div`
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;

  &:hover {
    cursor: ${({ disabled }: TContainerProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ disabled }: TContainerProps) => (disabled ? '#ffffff' : '#F8F9FB')};
  }
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
  user-select: none;
`

const WalletName = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  user-select: none;
`

const Amount = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ amount }: TAmountProps) => (amount > 0 ? '#3FBB7D' : '#1D1D22')};
  user-select: none;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  user-select: none;
`

const WalletNameRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 3px 0 0 0;
`

const AmountRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PendingIcon = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 6px 0 0;

  path {
    fill: #bdc4d4;
  }
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
  WalletNameRow,
  AmountRow,
  PendingIcon,
}

export default Styles

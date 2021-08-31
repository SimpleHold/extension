import styled from 'styled-components'

type TStatusProps = {
  isActive: boolean
}

const Row = styled.div`
  height: 387px;
`

const Group = styled.div`
  margin: 20px 0 0 0;
`

const GroupTitle = styled.p`
  margin: 0 6px 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Statuses = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Status = styled.div`
  flex: 1;
  background-color: ${({ isActive }: TStatusProps) => (isActive ? '#E9F7F0' : '#f2f4f8')};
  border-radius: 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: ${({ isActive }: TStatusProps) => (isActive ? '#3FBB7D' : '#7d7e8d')};
  }

  &:nth-child(2) {
    margin: 0 12px;
  }

  &:hover {
    cursor: ${({ isActive }: TStatusProps) => (isActive ? 'default' : 'pointer')};
    background-color: #e9f7f0;

    p {
      color: #3fbb7d;
    }
  }
`

const StatusTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
`

const GroupHeading = styled.div`
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px 0;
`

const ResetGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ResetTitle = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const ResetIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: #f2f4f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const CurrenciesList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: -10px;
`

const DropdownCurrency = styled.div`
  &:not(:first-child) {
    margin: 0 0 0 6px;
  }
`

const GroupTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AddressWarningIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #bdc4d4;
`

const Tooltip = styled.div`
  width: 275px;
  padding: 6px 0;

  button {
    height: 30px;
    width: auto;
    padding: 8px 16px;

    p {
      font-size: 12px;
      line-height: 14px;
    }
  }
`

const TooltipText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #7d7e8d;
`

const TooltipActions = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  align-items: center;
`

const WalletsList = styled.div`
  width: 100%;
  margin: -10px -16px;
`

const WalletItem = styled.div`
  padding: 8px 12px 8px 15px;
  background-color: #f2f4f8;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin: 4px 0 0 0;
  }
`

const WalletItemName = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const WalletItemButton = styled.div`
  width: 8px;
  height: 8px;
  background-color: red;
`

const Styles = {
  Row,
  Group,
  GroupTitle,
  Statuses,
  Status,
  StatusTitle,
  GroupHeading,
  ResetGroup,
  ResetTitle,
  ResetIcon,
  CurrenciesList,
  DropdownCurrency,
  GroupTitleRow,
  AddressWarningIcon,
  Tooltip,
  TooltipText,
  TooltipActions,
  WalletsList,
  WalletItem,
  WalletItemName,
  WalletItemButton,
}

export default Styles

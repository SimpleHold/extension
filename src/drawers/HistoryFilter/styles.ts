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
}

export default Styles

import styled from 'styled-components'

type TDropdownProps = {
  isEmpty: boolean
}

const Row = styled.div``

const SelectCurrencyRow = styled.div`
  padding: 20px 0 45px 0;
  position: relative;
`

const SelectedAmount = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
  position: absolute;
  bottom: 20px;
`

const DividerLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeaea;
`

const Filter = styled.div`
  padding: 15px 10px 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;

    & > p {
      color: #3fbb7d;
    }
  }
`

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const FilterTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const FilterBadge = styled.div`
  margin: 0 0 0 10px;
  padding: 3px 8px;
  background-color: #f8f8f8;
  border-radius: 5px;
`

const FilterBadgeText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #3fbb7d;
`

const SwitchRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Actions = styled.div`
  margin: 30px 0 0 0;
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding: ${({ isEmpty }: TDropdownProps) => (isEmpty ? '4px 0 4px 10px' : '0')};
`

const DropdownRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const ArrowIconRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: rotate(270deg);

    path {
      fill: #3fbb7d;
    }
  }
`

const DropdownCurrenciesList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const ThreeDots = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
  margin: 0 0 0 6px;
`

const DropdownCurrency = styled.div`
  &:not(:last-child) {
    margin-right: 6px;
  }
`

const DropdownLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
  flex: 1;
`

const Styles = {
  Row,
  SelectCurrencyRow,
  SelectedAmount,
  DividerLine,
  Filter,
  FilterRow,
  FilterTitle,
  FilterBadge,
  FilterBadgeText,
  SwitchRow,
  Actions,
  Dropdown,
  DropdownRow,
  ArrowIconRow,
  DropdownCurrenciesList,
  ThreeDots,
  DropdownCurrency,
  DropdownLabel,
}

export default Styles

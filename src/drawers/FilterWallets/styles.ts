import styled from 'styled-components'

const Row = styled.div``

const SelectCurrencyRow = styled.div`
  padding: 20px 0;
`

const SelectedAmount = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
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

const Switch = styled.div`
  width: 30px;
  height: 30px;
  background-color: red;
`

const Actions = styled.div`
  margin: 30px 0 0 0;
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
  Switch,
  Actions,
}

export default Styles

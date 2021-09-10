import styled from 'styled-components'

const Container = styled.div`
  height: 467px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Group = styled.div`
  margin: 20px 0 0 0;
`

const GroupHeading = styled.div`
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px 0;
`

const GroupTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const SortTypes = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const GroupClear = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ClearTitle = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const ClearButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #f2f4f8;
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

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Styles = {
  Container,
  Row,
  Group,
  GroupHeading,
  GroupTitle,
  SortTypes,
  GroupClear,
  ClearTitle,
  ClearButton,
  CurrenciesList,
  DropdownCurrency,
  Actions,
}

export default Styles

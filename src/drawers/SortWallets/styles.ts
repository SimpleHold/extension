import styled from 'styled-components'

import sortArrow from '@assets/icons/sortArrow.svg'

const Row = styled.div`
  margin: 10px 0 0 0;
`

const List = styled.div``

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
`

const ListItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const ListArrows = styled.div`
  width: 30px;
  height: 30px;
  margin: 0 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const ListArrow = styled.div`
  width: 8px;
  height: 6px;
  background-image: url(${sortArrow});
  background-repeat: no-repeat;

  &:last-child {
    margin: 3px 0 0 0;
  }
`

const ListTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const ListSortType = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Actions = styled.div`
  margin: 30px 0 0 0;
`

const Styles = {
  Row,
  List,
  ListItem,
  ListItemRow,
  ListArrows,
  ListArrow,
  ListTitle,
  ListSortType,
  Actions,
}

export default Styles

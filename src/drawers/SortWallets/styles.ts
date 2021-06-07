import styled from 'styled-components'

type TListItemProps = {
  isActive: boolean
}

type TListArrowProps = {
  position: 'up' | 'down'
  isActive: boolean
}

const Row = styled.div`
  margin: 10px 0 0 0;
`

const List = styled.div``

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #eaeaea;
  }

  path {
    fill: ${({ isActive }: TListItemProps) => (isActive ? '#3FBB7D' : '#C3C3C3')};
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
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

const ListArrowsRow = styled.div`
  width: 8px;
  height: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ListArrow = styled.div`
  width: 8px;
  height: 6px;
  background-repeat: no-repeat;
  transform: ${({ position }: TListArrowProps) =>
    `rotate(${position === 'down' ? '180' : '0'}deg)`};
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ isActive }: TListItemProps) => (isActive ? '#3FBB7D' : '#C3C3C3')};
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
  ListArrowsRow,
  ListArrow,
  ListTitle,
  ListSortType,
  Actions,
}

export default Styles

import styled from 'styled-components'

type TListProps = {
  color: string
}

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
  overflow: hidden;
`

const Container = styled.div`
  padding: 30px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const ListTitle = styled.p`
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const ListRow = styled.div`
  margin: 0 0 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  &:before {
    content: '';
    width: 1px;
    height: 100%;
    position: absolute;
    background-color: ${({ color }: TListProps) => color};
    top: 0;
    left: 10px;
  }
`

const ListDivider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const ListIconRow = styled.div`
  width: 21px;
  height: 21px;
  border-radius: 11px;
  background-color: ${({ color }: TListProps) => color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    z-index: 2;

    path {
      fill: #ffffff;
    }
  }
`

const List = styled.ul`
  padding: 0;
  margin: 0 0 0 9px;
  list-style: none;
`

const ListItem = styled.li`
  font-size: 14px;
  line-height: 20px;
  color: #1d1d22;

  &:not(:last-child) {
    margin: 0 0 5px 0;
  }
`

const Actions = styled.div`
  margin: 21px 0 0 0;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Description,
  ListTitle,
  ListRow,
  ListDivider,
  ListIconRow,
  List,
  ListItem,
  Actions,
}

export default Styles

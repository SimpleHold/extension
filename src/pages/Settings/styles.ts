import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  padding: 40px 30px 30px 30px;
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Title = styled.p`
  margin: 0;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
  font-weight: bold;
`

const Actions = styled.div``

const List = styled.div`
  margin: 25px 0 0 0;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    padding: 0 0 20px 0;
    margin: 0 0 20px 0;
    border-bottom: 1px solid #dfdfdf;
  }
`

const ListRow = styled.div``

const ListTitle = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const ListText = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Actions,
  List,
  ListItem,
  ListRow,
  ListTitle,
  ListText,
}

export default Styles

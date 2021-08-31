import styled from 'styled-components'

type TListItemProps = {
  isButton?: boolean
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  padding: 30px;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Title = styled.p`
  margin: 0;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
  font-weight: bold;
`

const Actions = styled.div``

const List = styled.div``

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isButton }: TListItemProps) => (isButton ? `15px 0` : '20px 0')};
  height: ${({ isButton }: TListItemProps) => (isButton ? `60px` : 'auto')};
  border-bottom: 1px solid #f2f4f8;

  &:hover {
    cursor: ${({ isButton }: TListItemProps) => (isButton ? `pointer` : 'default')};

    & > div > div > p {
      color: ${({ isButton }: TListItemProps) => (isButton ? `#3FBB7D` : '#1d1d22')};
    }

    path {
      fill: ${({ isButton }: TListItemProps) => (isButton ? `#3FBB7D` : '#1d1d22')};
    }
  }
`

const ListItemRow = styled.div``

const ListTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ListTitle = styled.p`
  margin: 0;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const IconRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  color: #7d7e8d;
`

const ExtensionInfo = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const CopyRight = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Version = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Actions,
  List,
  ListItem,
  ListItemRow,
  ListTitleRow,
  ListTitle,
  IconRow,
  Text,
  ExtensionInfo,
  CopyRight,
  Version,
}

export default Styles

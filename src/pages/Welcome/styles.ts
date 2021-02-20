import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  padding: 20px 30px;
`

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

const WalletActions = styled.div`
  margin: 32px 0 0 0;
`

const Action = styled.div`
  background: #fafafa;
  border: 1px dashed #dfdfdf;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 38px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:last-child) {
    margin: 0 0 20px 0;
  }

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }
`

const ActionIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ActionName = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;
`

const Links = styled.div`
  margin: 51px 0 0 0;
`

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin: 0 0 10px 0;
  }

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }

    path {
      fill: #3fbb7d;
    }
  }
`

const LinkIcon = styled.div`
  width: 17px;
  height: 17px;
  margin: 0 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Link = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  Description,
  WalletActions,
  Action,
  ActionIcon,
  ActionName,
  Links,
  LinkRow,
  LinkIcon,
  Link,
}

export default Styles

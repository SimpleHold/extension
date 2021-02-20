import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  height: 540px;
`

const Row = styled.div`
  padding: 20px 30px 30px 30px;
  background-color: #ffffff;
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

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 54px 0 0 0;

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

const Form = styled.div`
  padding: 30px 30px 0 30px;
  border-top: 1px solid #eaeaea;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Description,
  LinkRow,
  LinkIcon,
  Link,
  Form,
}

export default Styles

import styled from 'styled-components'

const Row = styled.div`
  margin: 10px 0 0 0;
`

const Text = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Link = styled.a`
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
  }
`

const Actions = styled.div`
  margin: 30px 0 0 0;
`

const Styles = {
  Row,
  Text,
  Link,
  Actions,
}

export default Styles

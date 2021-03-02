import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const Container = styled.div`
  height: 540px;
  padding: 30px;
`

const Image = styled.img`
  width: 315px;
  height: 150px;
`

const Title = styled.p`
  margin: 50px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Form = styled.form`
  margin: 15px 0 0 0;
`

const Actions = styled.div`
  margin: 5px 0 0 0;
`

const Links = styled.div`
  margin: 60px 0 0 0;
`

const Link = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  &:not(:last-child) {
    margin: 0 0 10px 0;
  }
`

const Styles = {
  Wrapper,
  Container,
  Image,
  Title,
  Form,
  Actions,
  Links,
  Link,
}

export default Styles

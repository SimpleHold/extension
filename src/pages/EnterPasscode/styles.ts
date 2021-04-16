import styled from 'styled-components'

import lockIllustrate from '@assets/illustrate/lock.svg'

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
  align-items: center;
`

const Row = styled.div``

const Image = styled.div`
  width: 315px;
  height: 150px;
  background-image: url(${lockIllustrate});
  background-repeat: no-repeat;
  background-size: contain;
`

const Title = styled.p`
  margin: 50px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const Form = styled.form`
  margin: 20px 0 0 0;
`

const Bottom = styled.div``

const Link = styled.a`
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Image,
  Title,
  Bottom,
  Link,
  Form,
}

export default Styles

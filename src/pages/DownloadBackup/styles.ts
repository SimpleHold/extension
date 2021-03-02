import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const Container = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 540px;
`

const Row = styled.div``

const Image = styled.img`
  width: 315px;
  height: 180px;
`

const Title = styled.p`
  margin: 50px 0 0 0;
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

const Styles = {
  Wrapper,
  Container,
  Row,
  Image,
  Title,
  Description,
}

export default Styles

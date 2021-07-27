import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  height: 540px;
  overflow: hidden;
  padding: 23px 30px 30px 30px;
`

const Title = styled.p`
  margin: 0 0 23px 0;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
  font-weight: bold;
`

const Styles = {
  Wrapper,
  Container,
  Title,
}

export default Styles

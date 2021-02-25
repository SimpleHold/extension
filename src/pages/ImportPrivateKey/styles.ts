import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  height: 540px;
  background-color: #f8f8f8;
  border-radius: 5px 5px 0 0;
`

const Heading = styled.div`
  padding: 30px;
  background-color: #ffffff;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.div`
  padding: 30px;
  border-top: 1px solid #eaeaea;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Styles = {
  Wrapper,
  Container,
  Heading,
  Title,
  Description,
  Form,
  Actions,
}

export default Styles

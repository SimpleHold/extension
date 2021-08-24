import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
  overflow: hidden;
`

const Container = styled.div`
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 30px;
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

const Form = styled.form`
  padding: 30px;
  border-top: 1px solid #dee1e9;
  background-color: #f8f8f8;
  flex: 1;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 44px 0 0 0;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Description,
  Form,
  Actions,
}

export default Styles

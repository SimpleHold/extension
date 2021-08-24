import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
  overflow: hidden;
`

const Container = styled.div`
  padding: 20px 30px 0 30px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Text = styled.p`
  margin: 10px 0 27px 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0 30px 0;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Text,
  Actions,
}

export default Styles

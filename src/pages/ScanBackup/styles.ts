import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 16px 16px 0px 0px;
  height: 540px;
  overflow: hidden;
  padding: 30px;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  padding: 60px 30px;
  background-color: #ffffff;
  border-radius: 16px;
`

const Styles = {
  Wrapper,
  Container,
  Row,
}

export default Styles

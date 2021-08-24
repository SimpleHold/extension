import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0 0;
  height: 540px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  padding: 20px 30px 30px 30px;
`

const Styles = {
  Wrapper,
  Container,
  Row,
}

export default Styles

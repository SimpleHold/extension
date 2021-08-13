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
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-direction: column;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Row = styled.div`
  flex: 1;
`

const Styles = {
  Wrapper,
  Container,
  Actions,
  Row,
}

export default Styles

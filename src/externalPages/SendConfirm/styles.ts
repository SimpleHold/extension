import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  height: 590px;
  overflow: hidden;
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  flex: 1;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Styles = {
  Container,
  Row,
  Actions,
}

export default Styles

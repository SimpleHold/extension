import styled from 'styled-components'

const Container = styled.div`
  background-color: #f2f4f8;
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

const NotFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

const NotFoundText = styled.p`
  margin: 20px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Styles = {
  Container,
  Row,
  Actions,
  NotFound,
  NotFoundText,
}

export default Styles

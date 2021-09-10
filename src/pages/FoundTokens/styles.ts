import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 30px 30px 0 30px;
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

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px 30px 30px;
`

const TokensList = styled.div`
  margin: 20px 0 0 0;
  max-height: 280px;
  overflow-y: scroll;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Description,
  Actions,
  TokensList,
}

export default Styles

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
  display: flex;
  flex-direction: column;
`

const Title = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
  font-weight: bold;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 13px 0 0 0;
`

const Row = styled.form`
  background-color: #ffffff;
  border-radius: 16px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  Body,
  Row,
  Actions,
}

export default Styles

import styled from 'styled-components'

type TListItemProps = {
  isButton?: boolean
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
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
  line-height: 25px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.form`
  border-top: 1px solid #eaeaea;
  background-color: #f8f8f8;
  padding: 30px;
  flex: 1;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 15px 0 0 0;
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

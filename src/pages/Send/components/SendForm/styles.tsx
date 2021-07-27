import styled from 'styled-components'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Form = styled.form`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 50px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Styles = {
  Container,
  Form,
  Actions,
}

export default Styles

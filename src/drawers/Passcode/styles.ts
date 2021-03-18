import styled from 'styled-components'

const Row = styled.div`
  margin: 20px 0 0 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  input {
    width: 45px;
    height: 50px;
    border: 1px solid #dfdfdf;
    border-radius: 5px;
    outline-color: #3fbb7d;
    font-weight: normal;
    font-size: 23px;
    line-height: 27px;
    color: #1d1d22;
    text-align: center;
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 37px 0 0 0;
`

const Styles = {
  Row,
  Form,
  Actions,
}

export default Styles

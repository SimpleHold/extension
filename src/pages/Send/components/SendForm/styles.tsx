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
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const FormRow = styled.div`
  border-top: 1px solid #f2f4f8;
  padding: 20px;
`

const NetworkFeeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0 0 0;
`

const NetworkFeeRow = styled.div`
  flex: 1;
`

const NetworkFeeLabel = styled.p`
  margin: 0 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
  color: #3fbb7d;
`

const NetworkFee = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #1d1d22;
`

const Styles = {
  Container,
  Form,
  Actions,
  FormRow,
  NetworkFeeBlock,
  NetworkFeeRow,
  NetworkFeeLabel,
  NetworkFee,
}

export default Styles

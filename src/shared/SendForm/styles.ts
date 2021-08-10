import styled from 'styled-components'

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  height: 540px;
  overflow: hidden;
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-direction: column;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Form = styled.div`
  border-top: 1px solid #f2f4f8;
  background-color: #ffffff;
  border-radius: 0 0 16px 16px;
`

const FormBody = styled.div`
  padding: 20px 20px 10px 20px;
`

const AboutFee = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;

  path {
    fill: #bdc4d4;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }

    p {
      color: #3fbb7d;
    }
  }
`

const AboutFeeIcon = styled.div`
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AboutFeeLabel = styled.p`
  margin: 0 0 0 6px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Container,
  Body,
  Row,
  Actions,
  Form,
  FormBody,
  AboutFee,
  AboutFeeIcon,
  AboutFeeLabel,
}

export default Styles

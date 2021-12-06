import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 16px 16px 0px 0px;
  height: 540px;
  overflow: hidden;
  padding: 68px 30px 30px 30px;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  flex: 1;
`

const QrCodeRow = styled.div`
  padding: 12px;
  background-color: #ffffff;
  border-radius: 16px;
  margin: 0 auto;
  width: fit-content;
`

const Text = styled.p`
  margin: 28px 18px 0 18px;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  QrCodeRow,
  Text,
}

export default Styles

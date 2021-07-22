import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  height: 540px;
  padding: 0 30px;
`

const Row = styled.div`
  padding: 20px 0 30px 0;
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  color: #1d1d22;
`

const Receive = styled.div`
  width: 100%;
  height: 300px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 38px 0 38px;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  word-break: break-all;
`

const Address = styled.p`
  margin: 16px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
`

const Warning = styled.p`
  margin: 20px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #7d7e8d;
`

const Button = styled.div`
  width: 30px;
  height: 30px;
`

const MoreButton = styled(Button)`
  background: rgba(222, 225, 233, 0.6);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;
    background: rgba(222, 225, 233, 0.4);

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Heading,
  Title,
  Receive,
  Address,
  Warning,
  Button,
  MoreButton,
}

export default Styles

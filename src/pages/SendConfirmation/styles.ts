import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  padding: 45px 30px 30px 30px;
  height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 50px;
  background-color: #ffffff;
  border-radius: 16px;
  position: relative;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CurrencyLogo = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Title = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
  font-weight: bold;
`

const SubTitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Actions,
  CurrencyLogo,
  Title,
  SubTitle,
}

export default Styles

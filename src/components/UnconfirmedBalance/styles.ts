import styled from 'styled-components'

const Container = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  border-radius: 5px;
`

const Title = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.8;
`

const Values = styled.div``

const BTCValue = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: #ffffff;
`

const USDValue = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: #ffffff;
`

const Styles = {
  Container,
  Title,
  Values,
  BTCValue,
  USDValue,
}

export default Styles

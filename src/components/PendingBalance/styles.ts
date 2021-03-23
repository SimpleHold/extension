import styled from 'styled-components'

type TProps = {
  type: 'light' | 'gray'
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
`

const IconRow = styled.div`
  padding: 7px 10px;
  height: 30px;
`

const Row = styled.div`
  border-left: 1px solid #38b175;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
`

const BTCValue = styled.p`
  margin: 0 10px 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`

const USDValue = styled.p`
  margin: 0;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`

const Styles = {
  Container,
  IconRow,
  Row,
  BTCValue,
  USDValue,
}

export default Styles

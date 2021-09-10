import styled from 'styled-components'

const Container = styled.div`
  padding: 14px 30px;
  overflow: hidden;
  position: relative;

  &:hover {
    cursor: pointer;

    .address {
      color: #3fbb7d;
    }

    .button {
      display: flex;
    }
  }
`

const Address = styled.div`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #1d1d22;
`

const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 0 0 0;
`

const Amount = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #7d7e8d;
`

const Estimated = styled.p`
  margin: 0 0 0 10px;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Button = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #f2f4f8;
  align-items: center;
  justify-content: center;
  display: none;
  position: absolute;
  right: 30px;
  top: 20px;

  path {
    fill: #3fbb7d;
  }
`

const Styles = {
  Container,
  Address,
  Info,
  Amount,
  Estimated,
  Button,
}

export default Styles

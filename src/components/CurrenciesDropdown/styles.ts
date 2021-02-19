import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  margin: 0 0 10px 0;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin: 0 0 0 15px;
`

const Address = styled.p`
  flex: 1;
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #7d7e8d;
`

const Button = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`

const ArrowIcon = styled.div`
  width: 7.5px;
  height: 7.5px;
  border: 2px solid #3fbb7d;
  transform: rotate(45deg);
`

const Styles = {
  Container,
  Row,
  Address,
  Button,
  ArrowIcon,
}

export default Styles

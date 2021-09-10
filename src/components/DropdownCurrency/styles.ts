import styled from 'styled-components'

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    background: #f8f9fb;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 15px;
  flex: 1;
`

const Name = styled.p`
  flex: 1;
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
`

const CheckBoxRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Styles = {
  Container,
  Row,
  Name,
  CheckBoxRow,
}

export default Styles

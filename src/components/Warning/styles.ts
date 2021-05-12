import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 20px 0 0 0;
`

const IconRow = styled.div`
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.p`
  margin: 0 0 0 6px;
  flex: 1;
  font-size: 14px;
  line-height: 19px;
  color: #c3c3c3;
`

const Styles = {
  Container,
  IconRow,
  Text,
}

export default Styles

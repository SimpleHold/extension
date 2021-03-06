import styled from 'styled-components'

const Container = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  border: 1px solid #c3c3c3;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #3fbb7d;
`

const Styles = {
  Container,
  Dot,
}

export default Styles

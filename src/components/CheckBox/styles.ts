import styled from 'styled-components'

const Container = styled.div`
  width: 16px;
  height: 16px;
  border: 1.5px solid #7d7e8d;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    border: 1.5px solid #3fbb7d;
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
}

export default Styles

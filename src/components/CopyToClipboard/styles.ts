import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }
  }
`

const Row = styled.div``

const Styles = {
  Container,
  Row,
}

export default Styles

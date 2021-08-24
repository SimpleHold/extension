import styled from 'styled-components'

const Row = styled.div`
  margin: 10px 0 0 0;
`

const Text = styled.p`
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
  margin: 0;

  &:not(:first-child) {
    margin: 10px 0 0 0;
  }
`

const Styles = {
  Row,
  Text,
}

export default Styles

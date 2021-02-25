import styled from 'styled-components'

const Row = styled.div`
  width: 100%;
`

const Title = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
`

const Text = styled.p`
  margin: 7px 0 0 0;
  text-align: center;
  font-size: 16px;
  line-height: 23px;
  color: #3fbb7d;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px 0 0 0;
`

const Styles = {
  Row,
  Title,
  Text,
  Actions,
}

export default Styles

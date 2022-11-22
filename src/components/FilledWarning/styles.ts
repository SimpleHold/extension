import styled from 'styled-components'

const Container = styled.div`
  padding: 8px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #ffefef;
  border: 1px solid rgba(250, 94, 94, 0.2);
  border-radius: 12px;
`

const Icon = styled.div`
  width: 20px;
  height: 20px;
`

const Text = styled.p`
  margin: 0 0 0 8px;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #fa5e5e;
`

const Styles = {
  Container,
  Icon,
  Text,
}

export default Styles

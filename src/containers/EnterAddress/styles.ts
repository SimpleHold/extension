import styled from 'styled-components'

type TRowProps = {
  openFrom?: string
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: ${({ openFrom }: TRowProps) => (openFrom === 'browser' ? '0 0 24px 0' : '24px')};
`

const Top = styled.div``

const Styles = {
  Container,
  Row,
  Top,
}

export default Styles

import styled from 'styled-components'

type TTabProps = {
  isActive: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Tab = styled.div`
  flex: 1;
  background-color: ${({ isActive }: TTabProps) => (isActive ? 'red' : 'blue')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`

const TabTitle = styled.p`
  margin: 0;
`

const Styles = {
  Container,
  Tab,
  TabTitle,
}

export default Styles

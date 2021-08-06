import styled from 'styled-components'

type TTabProps = {
  isActive: boolean
}

const Container = styled.div``

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
`

const Tab = styled.div`
  flex: 1;
  padding: ${({ isActive }: TTabProps) => (isActive ? '16px 0' : '16px 0 18px 0')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${({ isActive }: TTabProps) => (isActive ? '2px solid #3FBB7D' : 'none')};

  p {
    color: ${({ isActive }: TTabProps) => (isActive ? '#3FBB7D' : '#7D7E8D')};
    font-weight: ${({ isActive }: TTabProps) => (isActive ? '500' : 'normal')};
  }

  &:hover {
    cursor: ${({ isActive }: TTabProps) => (isActive ? 'default' : 'pointer')};
    border-bottom: 2px solid #3fbb7d;
    padding: 16px 0;

    p {
      color: #3fbb7d;
      font-weight: 500;
    }
  }
`

const TabTitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
`

const Styles = {
  Container,
  Tabs,
  Tab,
  TabTitle,
}

export default Styles

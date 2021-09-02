import styled from 'styled-components'

type TTabProps = {
  isActive: boolean
}

type TBadgeProps = {
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

const TabRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Badge = styled.div`
  padding: 3px 8px;
  background-color: ${({ isActive }: TBadgeProps) =>
    isActive ? 'rgba(215, 239, 227, 0.7)' : '#f2f4f8'};
  border-radius: 10px;
  margin: 0 0 0 6px;

  span {
    color: ${({ isActive }: TBadgeProps) => (isActive ? '#3FBB7D' : '#7D7E8D')};
  }
`

const BadgeText = styled.span`
  margin: 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
`

const Styles = {
  Container,
  Tabs,
  Tab,
  TabTitle,
  TabRow,
  Badge,
  BadgeText,
}

export default Styles

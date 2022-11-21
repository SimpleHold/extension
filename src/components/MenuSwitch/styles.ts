import styled from 'styled-components'

type TProps = {
  isActive?: boolean
  isRightPosition?: boolean
  isCollapsed?: boolean
}

const Container = styled.div`
  height: 36px;
  width: ${({ isCollapsed }: TProps) => (isCollapsed ? '80px' : '154px')};
  border-radius: ${({ isCollapsed }: TProps) => (isCollapsed ? '12px' : '22px')};
  border: ${({ isCollapsed }: TProps) => (isCollapsed ? 'border: 1px solid #62C28A' : 'none')};
  display: flex;
  align-items: center;
  background-color: #f5f5f7;
  position: relative;

  .thumb {
    transform: ${({ isRightPosition, isCollapsed }: TProps) => {
      const value = isCollapsed ? 40 : 77
      return `translateX(${isRightPosition ? value : 0}px)`
    }};
  }

  &:hover {
    cursor: pointer;
  }
`

const Title = styled.span`
  width: 77px;
  text-align: center;
  z-index: 2;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: ${({ isActive }: TProps) => (isActive ? '#fff' : '#000')};
  transition: 0.3s ease;
  user-select: none;
`

const Icon = styled.div`
  z-index: 2;
  transition: all 0.2s ease;
  width: 40px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    path {
      transition: all 0.4s ease;
      fill: ${({ isActive }: TProps) => (isActive ? '#fff' : '#3FBB7D')};
    }
  }
`

const Thumb = styled.div`
  background-color: #3fbb7d;
  transition: transform 0.3s ease;
  height: 36px;
  width: ${({ isCollapsed }: TProps) => (isCollapsed ? '40px' : '77px')};
  border-radius: ${({ isCollapsed }: TProps) => (isCollapsed ? '12px' : '22px')};
  position: absolute;
  z-index: 1;
`

const Styles = {
  Container,
  Title,
  Thumb,
  Icon,
}

export default Styles

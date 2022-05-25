import styled from 'styled-components'

type TProps = {
  isCollapsed?: boolean
  withBadge?: boolean
}

const Container = styled.div`
`


const Wrapper = styled.div`
  opacity: ${({ isCollapsed }: TProps) => isCollapsed ? 1 : 0};

  &, * {
    transition: 0.4s ease;
  }

  &:hover {
    cursor: pointer;

    .badge {
      background-color: #fff;
    }

    .circle {
      background-color: #31a76c;
    }

    span {
      color: #31a76c;
    }

    svg {
      line {
        stroke: #fff;
      }
    }
  }
`

const Badge = styled.div`
  background-color: #3FBB7D;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 8px 16px 8px 14px;
  width: 90px;
  height: 36px;
`

const Label = styled.span`
  padding-top: 1px;
  user-select: none;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #fff;
`

const Styles = {
  Container,
  Wrapper,
  Badge,
  Label,
}

export default Styles
